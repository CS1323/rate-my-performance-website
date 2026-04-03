/**
 * Vercel Edge Middleware — Google Analytics Proxy
 *
 * Intercepts /api/ga/p.js (gtag script) and /g/collect (event beacons) and
 * forwards them to the Express backend, which proxies to Google. Running on
 * the same origin as the frontend page means:
 *   - No cross-subdomain cookie domain mismatch (_ga cookies set correctly).
 *   - Requests appear first-party to the browser, bypassing adblockers.
 */
export const config = {
  matcher: ['/api/ga/p.js', '/g/collect'],
};

export default async function middleware(request) {
  const backendUrl = process.env.BACKEND_URL;

  if (!backendUrl) {
    return new Response('Analytics proxy not configured', { status: 503 });
  }

  const url = new URL(request.url);
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

  // Strip Set-Cookie headers — Google's collect endpoint may set cookies scoped
  // to google-analytics.com, which the browser rejects for our domain.
  // GA cookies (_ga, _ga_*) are set by the gtag.js script via document.cookie
  // on the correct frontend domain instead.
  const headers = new Headers(response.headers);
  headers.delete('set-cookie');

  return new Response(response.body, {
    status: response.status,
    headers,
  });
}
