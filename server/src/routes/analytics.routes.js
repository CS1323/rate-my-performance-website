import express from 'express';
import { proxyGtagScript, proxyCollect } from '../controllers/analytics.controller.js';

const router = express.Router();

// Proxy the gtag.js loader script from Google Tag Manager.
// Path deliberately avoids known adblocker filter patterns like /gtag/js.
router.get('/api/ga/p.js', proxyGtagScript);

// Proxy GA4 collect beacons to Google Analytics.
// GA4 always appends /g/collect to transport_url — this cannot be renamed.
// Hosting on our own domain is sufficient to bypass domain-based blocking.
// express.text() captures the raw body without parsing — GA sends Content-Type: text/plain
router.all('/g/collect', express.text({ type: '*/*' }), proxyCollect);

export default router;
