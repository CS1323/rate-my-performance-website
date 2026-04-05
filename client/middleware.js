/**
 * Vercel Edge Middleware — Google Analytics Proxy
 *
 * /api/ga/p.js  — proxied to Render backend, which rewrites /g/collect paths
 *                 and appends the base64 query-obfuscation interceptor.
 * /api/ga/c     — forwarded DIRECTLY to Google Analytics from Vercel Edge.
 *
 * Sending collect beacons from Vercel Edge (not from Render) gives regionally
 * accurate geolocation in GA4: Vercel runs 30+ globally-distributed edge nodes,
 * so Google sees a node IP near the user rather than Render's single Baltimore
 * datacenter IP. GA4 v2 has no IP override parameter, so edge proximity is the
 * only way to achieve regional accuracy with a server-side proxy.
 */
export const config = {
  matcher: ['/api/ga/p.js', '/api/ga/c'],
};

export default async function middleware(request) {
  const url = new URL(request.url);

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

    await fetch('https://www.google-analytics.com/g/collect' + targetSearch, {
      method: request.method,
      headers: {
        'content-type': request.headers.get('content-type') || 'text/plain',
        'user-agent': request.headers.get('user-agent') || '',
      },
      body,
    });

    // Always 204 — analytics failures must not surface to the client
    return new Response(null, { status: 204 });
  }

  // --- gtag.js script: proxy through Render backend for rewriting ---
  const backendUrl = process.env.BACKEND_URL;

  if (!backendUrl) {
    return new Response('Analytics proxy not configured', { status: 503 });
  }

  const targetUrl = new URL(url.pathname + url.search, backendUrl);
  const proxyReq = new Request(targetUrl.toString(), {
    method: request.method,
    headers: {
      'content-type': request.headers.get('content-type') || 'text/plain',
      'user-agent': request.headers.get('user-agent') || '',
      'x-forwarded-for': request.headers.get('x-forwarded-for') || '',
    },
    body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
  });

  const response = await fetch(proxyReq);

  // Strip Set-Cookie headers — GA cookies are set by the gtag.js script via
  // document.cookie on the correct frontend domain instead.
  const headers = new Headers(response.headers);
  headers.delete('set-cookie');

  return new Response(response.body, { status: response.status, headers });
}
