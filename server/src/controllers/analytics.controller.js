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

    const script = await response.text();
    res.set('Content-Type', 'text/javascript; charset=utf-8');
    res.set('Cache-Control', 'public, max-age=3600');
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
    for (const [key, value] of Object.entries(req.query)) {
      targetUrl.searchParams.set(key, value);
    }

    const headers = {
      'Content-Type': req.headers['content-type'] || 'text/plain',
      'User-Agent': req.headers['user-agent'] || '',
    };

    // Preserve the original user IP so GA can resolve accurate geolocation.
    // With trust proxy enabled, req.ip is the leftmost (real user) IP.
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.ip;
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
