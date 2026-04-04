import express from 'express';
import { proxyGtagScript, proxyCollect } from '../controllers/analytics.controller.js';

const router = express.Router();

// Proxy the gtag.js loader script from Google Tag Manager.
// Path deliberately avoids known adblocker filter patterns like /gtag/js.
router.get('/api/ga/p.js', proxyGtagScript);

// Proxy GA4 collect beacons to Google Analytics.
// Path is obfuscated to avoid adblocker filter rules that match /g/collect.
// The proxied gtag.js script is rewritten to use this path instead.
// express.text() captures the raw body without parsing — GA sends Content-Type: text/plain
router.all('/api/ga/c', express.text({ type: '*/*' }), proxyCollect);

export default router;
