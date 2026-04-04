import logger from '../utils/logger.js';

/**
 * Proxy the Google Tag Manager gtag.js script through our own domain.
 * This allows the script to load as a first-party request, bypassing adblocker rules
 * that target third-party googletagmanager.com requests.
 */
export const proxyGtagScript = async (req, res) => {
  try {
    const targetUrl = new URL('https://www.googletagmanager.com/gtag/js');
    for (const [key, value] of Object.entries(req.query)) {
      targetUrl.searchParams.set(key, value);
    }

    const response = await fetch(targetUrl.toString());

    if (!response.ok) {
      return res.status(response.status).end();
    }

    let script = await response.text();

    // Rewrite the hardcoded /g/collect endpoint inside the gtag.js bundle so
    // the library POSTs beacons to our obfuscated path instead of the well-known
    // one that adblockers block by path pattern.
    script = script.replaceAll('/g/collect', '/api/ga/c');

    // Append an interceptor that base64-encodes the full query string into a
    // single opaque `z` param before every fetch/sendBeacon to /api/ga/c.
    // This hides GA4-specific query params (tid=G-*, v=2, cid=) that adblockers
    // like AdGuard and uBlock Origin use as fingerprints for blocking.
    script += `
;(function(){
var _f=window.fetch;
window.fetch=function(r,o){
if(typeof r==='string'&&r.indexOf('/api/ga/c')!==-1){
var u=new URL(r,location.origin),q=u.search.slice(1);
if(q){u.search='?z='+btoa(q);r=u.toString();}
}
return _f.call(this,r,o);
};
var _sb=navigator.sendBeacon;
if(_sb)navigator.sendBeacon=function(u,d){
if(u&&u.indexOf('/api/ga/c')!==-1){
var p=new URL(u,location.origin),q=p.search.slice(1);
if(q){p.search='?z='+btoa(q);u=p.toString();}
}
return _sb.call(navigator,u,d);
};
})();
`;

    res.set('Content-Type', 'text/javascript; charset=utf-8');
    // no-store: Firefox cached the old script with /g/collect paths;
    // always serve fresh rewritten bundle.
    res.set('Cache-Control', 'no-store');
    res.send(script);
  } catch (err) {
    logger.error('Analytics gtag.js proxy error:', { message: err.message });
    res.status(502).end();
  }
};

/**
 * Proxy GA4 collect requests to Google Analytics on behalf of the browser.
 * By routing through our own domain, adblockers that block google-analytics.com
 * will no longer intercept these requests.
 *
 * The original client IP is forwarded via X-Forwarded-For so GA preserves
 * accurate geolocation data.
 */
export const proxyCollect = async (req, res) => {
  try {
    const targetUrl = new URL('https://www.google-analytics.com/g/collect');

    // If the query string was base64-encoded into a single `z` param by the
    // gtag.js interceptor (to bypass adblocker fingerprinting), decode it.
    // Otherwise fall back to the raw query params (backwards-compatible).
    let querySource = req.query;
    if (req.query.z) {
      try {
        querySource = Object.fromEntries(
          new URLSearchParams(Buffer.from(req.query.z, 'base64').toString())
        );
      } catch {
        // Malformed base64 — fall through to raw req.query
      }
    }

    for (const [key, value] of Object.entries(querySource)) {
      targetUrl.searchParams.set(key, value);
    }

    const headers = {
      'Content-Type': req.headers['content-type'] || 'text/plain',
      'User-Agent': req.headers['user-agent'] || '',
    };

    // Preserve the original user IP so GA can resolve accurate geolocation.
    // With trust proxy = 1, req.ip is the real client IP from X-Forwarded-For.
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.ip;

    logger.debug('Analytics collect proxy:', {
      clientIp,
      xff: req.headers['x-forwarded-for'],
      reqIp: req.ip,
      encoded: !!req.query.z,
      tid: querySource.tid,
    });

    if (clientIp) {
      // `uip` is the GA Measurement Protocol parameter for user IP override;
      // this takes precedence over server-IP-based geolocation in GA4.
      targetUrl.searchParams.set('uip', clientIp);
      headers['X-Forwarded-For'] = clientIp;
    }

    await fetch(targetUrl.toString(), {
      method: req.method,
      headers,
      body: req.method !== 'GET' && req.body ? req.body : undefined,
    });

    // Always return 204 — analytics failures are non-critical and should not
    // surface as errors to the client
    res.status(204).end();
  } catch (err) {
    logger.error('Analytics collect proxy error:', { message: err.message });
    res.status(204).end();
  }
};
