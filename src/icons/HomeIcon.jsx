const HomeIcon = ({ className = '' }) => {
  return (
    <svg viewBox="0 0 128 128" className={className} fill="currentColor">
      <path d="M64 20 L32 64 L64 52 L64 96 L96 52 L64 20" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"/>
      <path d="M40 64 L88 64 L88 96 L40 96 Z" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3"/>
    </svg>
  );
};

export default HomeIcon;
