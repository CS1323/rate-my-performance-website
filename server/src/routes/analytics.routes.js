import express from 'express';
import { proxyGtagScript, proxyCollect } from '../controllers/analytics.controller.js';

const router = express.Router();

// Proxy the gtag.js loader script from Google Tag Manager
// Browser requests: GET /gtag/js?id=G-XXXXX
router.get('/gtag/js', proxyGtagScript);

// Proxy GA4 collect beacons to Google Analytics
// gtag.js sends to {transport_url}/g/collect via GET (debug) and POST (production)
// express.text() captures the raw body without parsing — GA sends Content-Type: text/plain
router.all('/g/collect', express.text({ type: '*/*' }), proxyCollect);

export default router;
