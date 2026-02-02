import { IconBase } from './IconBase';

// Simple hockey puck - black cylinder viewed from angle
export const HockeyPuckIcon = (props) => (
  <IconBase viewBox="0 0 24 24" {...props}>
    <ellipse cx="12" cy="8" rx="10" ry="3" fill="currentColor"/>
    <rect x="2" y="8" width="20" height="8" fill="currentColor"/>
    <ellipse cx="12" cy="16" rx="10" ry="3" fill="currentColor"/>
    <ellipse cx="12" cy="16" rx="8" ry="2" fill="rgba(255,255,255,0.1)"/>
  </IconBase>
);