import { IconBase } from './IconBase';

// Professional hockey jersey with realistic proportions  
export const HockeyJerseyIcon = (props) => (
  <IconBase viewBox="0 0 24 24" {...props}>
    {/* Jersey body */}
    <path d="M8 5 C8 4.4 8.4 4 9 4 L15 4 C15.6 4 16 4.4 16 5 L16 6 L19 7 C19.6 7.2 20 7.8 20 8.4 L20 11 L18 11 L18 20 C18 21.1 17.1 22 16 22 L8 22 C6.9 22 6 21.1 6 20 L6 11 L4 11 L4 8.4 C4 7.8 4.4 7.2 5 7 L8 6 L8 5 Z" fill="currentColor"/>
    {/* V-neck */}
    <path d="M10 4 L12 6 L14 4" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" fill="none"/>
    {/* Jersey number 99 */}
    <text x="12" y="15" textAnchor="middle" fontSize="5" fill="rgba(255,255,255,0.9)" fontWeight="bold">99</text>
    {/* Sleeve stripes */}
    <rect x="4.5" y="9" width="2" height="0.5" fill="rgba(255,255,255,0.2)"/>
    <rect x="17.5" y="9" width="2" height="0.5" fill="rgba(255,255,255,0.2)"/>
    {/* Jersey seams */}
    <path d="M9 5 L9 21" stroke="rgba(255,255,255,0.1)" strokeWidth="0.2"/>
    <path d="M15 5 L15 21" stroke="rgba(255,255,255,0.1)" strokeWidth="0.2"/>
  </IconBase>
);