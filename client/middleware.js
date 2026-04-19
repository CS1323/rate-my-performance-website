/**
 * Vercel Edge Middleware — Google Analytics Proxy
 *
 * /api/ga/p.js  — handled entirely at Vercel Edge: fetches gtag.js from Google,
 *                 rewrites /g/collect paths, and prepends the base64
 *                 query-obfuscation interceptor. No Render backend call needed,
 *                 so GA script loading has no cold-start latency.
 * /api/ga/c     — forwarded DIRECTLY to Google Analytics from Vercel Edge.
 *
 * Sending both script and collect through Vercel Edge gives regionally accurate
 * geolocation in GA4: Vercel runs 30+ globally-distributed edge nodes, so Google
 * sees a node IP near the user rather than Render's single datacenter IP.
 * GA4 v2 has no IP override parameter, so edge proximity is the only way to
 * achieve regional accuracy with a server-side proxy.
 */
export const config = {
  matcher: ['/api/ga/p.js', '/api/ga/c'],
};

export default async function middleware(request) {
  const url = new URL(request.url);

  // --- gtag.js script: fetch from Google at Edge, rewrite paths, inject interceptor ---
  // Handled entirely at Vercel Edge — no Render backend call — to eliminate
  // cold-start latency that would prevent GA from initializing on first load.
  if (url.pathname === '/api/ga/p.js') {
    const targetUrl = new URL('https://www.googletagmanager.com/gtag/js');
    for (const [key, value] of url.searchParams) {
      targetUrl.searchParams.set(key, value);
    }

    try {
      const res = await fetch(targetUrl.toString(), {
        headers: {
          'user-agent': request.headers.get('user-agent') || '',
        },
      });

      if (!res.ok) {
        return new Response(null, { status: res.status });
      }

      let script = await res.text();

      // Rewrite the hardcoded /g/collect endpoint inside the gtag.js bundle so
      // the library POSTs beacons to our obfuscated path instead of the well-known
      // one that adblockers block by path pattern.
      script = script.replaceAll('/g/collect', '/api/ga/c');

      // PREPEND an interceptor that base64-encodes the full query string into a
      // single opaque `z` param before every fetch/sendBeacon/XHR/Image to
      // /api/ga/c. Prepending (not appending) ensures the interceptor wraps
      // the native APIs BEFORE gtag.js executes and captures its own references.
      // This hides GA4-specific query params (tid=G-*, v=2, cid=) that adblockers
      // like AdGuard and uBlock Origin use as fingerprints for blocking.
      const interceptor = ';(function(){' +
        // --- encode helper ---
        "function enc(s){" +
        "var u=new URL(s,location.origin),q=u.search.slice(1);" +
        "if(q){u.search='?z='+btoa(q);}" +
        "return u.toString();" +
        "}" +
        "function isGa(s){return typeof s==='string'&&s.indexOf('/api/ga/c')!==-1;}" +
        // --- fetch ---
        'var _f=window.fetch;' +
        'window.fetch=function(r,o){' +
        "if(isGa(r)){r=enc(r);}" +
        'return _f.call(this,r,o);' +
        '};' +
        // --- sendBeacon ---
        'var _sb=navigator.sendBeacon;' +
        'if(_sb)navigator.sendBeacon=function(u,d){' +
        "if(isGa(u)){u=enc(u);}" +
        'return _sb.call(navigator,u,d);' +
        '};' +
        // --- XMLHttpRequest (fallback transport) ---
        'var _xo=XMLHttpRequest.prototype.open;' +
        'XMLHttpRequest.prototype.open=function(m,u){' +
        "if(isGa(u)){u=enc(u);}" +
        'return _xo.apply(this,[m,u].concat([].slice.call(arguments,2)));' +
        '};' +
        // --- Image pixel (fallback transport) ---
        'var _Img=window.Image;' +
        'window.Image=function(w,h){' +
        'var img=new _Img(w,h);' +
        'var desc=Object.getOwnPropertyDescriptor(_Img.prototype,"src")||' +
        'Object.getOwnPropertyDescriptor(HTMLImageElement.prototype,"src");' +
        'if(desc&&desc.set){' +
        'Object.defineProperty(img,"src",{' +
        "set:function(v){if(isGa(v)){v=enc(v);}desc.set.call(this,v);}," +
        'get:function(){return desc.get.call(this);}' +
        '});' +
        '}' +
        'return img;' +
        '};' +
        '})();';

      script = interceptor + script;

      return new Response(script, {
        status: 200,
        headers: {
          'Content-Type': 'text/javascript; charset=utf-8',
          // no-store: always serve fresh rewritten bundle so adblocker path
          // rewrites and the interceptor are never stale-cached by the browser.
          'Cache-Control': 'no-store',
        },
      });
    } catch {
      return new Response(null, { status: 502 });
    }
  }

  // --- Collect beacons: forward directly to Google from Vercel Edge ---
  if (url.pathname === '/api/ga/c') {
    // Decode the base64-obfuscated query string (?z=...) appended by the
    // gtag.js interceptor. This hides GA4 fingerprint params from adblockers.
    let targetSearch = url.search;
    const z = new URLSearchParams(url.search).get('z');
    if (z) {
      try {
        targetSearch = '?' + atob(z);
      } catch { /* malformed base64 — fall through to raw params */ }
    }

    const body = ['GET', 'HEAD'].includes(request.method)
      ? undefined
      : await request.text();

    const xff = request.headers.get('x-forwarded-for');
    const clientIp = xff ? xff.split(',')[0].trim() : null;
    const collectParams = new URLSearchParams(targetSearch.slice(1));
    if (clientIp) collectParams.set('uip', clientIp);

    // Debug: log decoded params to confirm GA data is being received
    const page = collectParams.get('dp') || '/';
    const pageTitle = collectParams.get('dt') || 'unknown';
    console.log('[GA proxy] Decoded params:', {
      page,
      pageTitle,
      z: z ? 'present' : 'missing',
      tid: collectParams.get('tid'),
      en: collectParams.get('en'),
      debug_mode: collectParams.get('debug_mode') ? 'present' : 'missing',
      ep_debug_mode: collectParams.get('ep.debug_mode') ? 'present' : 'missing',
    });

    // Debug: log before forwarding to confirm we're calling Google
    console.log('[GA proxy] Forwarding to Google:', {
      url: 'https://www.google-analytics.com/g/collect',
      method: request.method,
      tid: collectParams.get('tid'),
    });

    const googleRes = await fetch('https://www.google-analytics.com/g/collect?' + collectParams.toString(), {
      method: request.method,
      headers: {
        'content-type': request.headers.get('content-type') || 'text/plain',
        'user-agent': request.headers.get('user-agent') || '',
      },
      body,
    });

    // Log non-2xx responses to Vercel function logs so rejected beacons are visible.
    // The client always gets 204 — analytics failures must not surface to the browser.
    if (!googleRes.ok) {
      console.error('[GA proxy] Google rejected beacon', {
        status: googleRes.status,
        en: collectParams.get('en') ?? 'unknown',
        tid: collectParams.get('tid') ?? 'unknown',
      });
    }

    // Always 204 — analytics failures must not surface to the client
    return new Response(null, { status: 204 });
  }
}
