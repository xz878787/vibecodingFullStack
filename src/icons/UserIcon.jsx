const UserIcon = ({ className = '' }) => {
  return (
    <svg viewBox="0 0 128 128" className={className} fill="currentColor">
      <circle cx="64" cy="36" r="20" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="3"/>
      <path d="M40 60 L88 60" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3"
            strokeLinecap="round"/>
      <path d="M64 60 L64 100" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3"/>
      <path d="M64 80 L40 100" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3"/>
      <path d="M64 80 L88 100" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3"/>
    </svg>
  );
};

export default UserIcon;
