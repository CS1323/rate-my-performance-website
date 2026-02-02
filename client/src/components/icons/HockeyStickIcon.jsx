import { IconBase } from './IconBase';

// Professional hockey stick with proper proportions
export const HockeyStickIcon = (props) => (
  <IconBase viewBox="0 0 24 24" {...props}>
    {/* Stick shaft */}
    <rect x="7" y="2" width="2" height="14" rx="1" fill="currentColor"/>
    {/* Stick blade */}
    <rect x="6" y="16" width="12" height="4" rx="2" fill="currentColor"/>
    {/* Blade curve */}
    <path d="M18 18 Q20 17 20 19 Q20 21 18 20" fill="currentColor"/>
    {/* Shaft highlight */}
    <rect x="7.5" y="3" width="0.5" height="12" fill="rgba(255,255,255,0.2)"/>
    {/* Grip tape */}
    <rect x="6.5" y="4" width="3" height="1" fill="rgba(0,0,0,0.2)"/>
  </IconBase>
);