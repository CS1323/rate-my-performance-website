// Base icon component providing consistent props API
export const IconBase = ({ 
  children, 
  size = 24, 
  color = 'currentColor', 
  className = '', 
  ...props 
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    style={{ color, fill: color }}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    {children}
  </svg>
);