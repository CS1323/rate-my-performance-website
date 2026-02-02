import { IconBase } from './IconBase';

// Professional ice hockey skates with detailed boot and blade
export const IceSkatesIcon = (props) => (
  <IconBase viewBox="0 0 24 24" {...props}>
    {/* Boot upper */}
    <path d="M5 8 C5 6.9 5.9 6 7 6 L13 6 C14.1 6 15 6.9 15 8 L15 12 L5 12 L5 8 Z" fill="currentColor"/>
    {/* Boot lower and ankle protection */}
    <path d="M3 12 C3 11.4 3.4 11 4 11 L16 11 C17.7 11 19 12.3 19 14 L19 16 L21 16 C21.6 16 22 16.4 22 17 C22 17.6 21.6 18 21 18 L4 18 C3.4 18 3 17.6 3 17 L3 12 Z" fill="currentColor"/>
    {/* Ice blade */}
    <rect x="2" y="18" width="20" height="2" rx="1" fill="currentColor"/>
    {/* Boot eyelets */}
    <circle cx="7.5" cy="8.5" r="0.4" fill="rgba(255,255,255,0.4)"/>
    <circle cx="9.5" cy="8.5" r="0.4" fill="rgba(255,255,255,0.4)"/>
    <circle cx="11.5" cy="8.5" r="0.4" fill="rgba(255,255,255,0.4)"/>
    {/* Blade edge highlight */}
    <rect x="3" y="19" width="18" height="0.3" fill="rgba(255,255,255,0.3)"/>
  </IconBase>
);