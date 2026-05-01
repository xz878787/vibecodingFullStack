const SettingsIcon = ({ className = '' }) => {
  return (
    <svg viewBox="0 0 128 128" className={className} fill="currentColor">
      <circle cx="64" cy="64" r="32" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="3"/>
      <circle cx="64" cy="32" r="4" 
              fill="currentColor"/>
      <circle cx="96" cy="64" r="4" 
              fill="currentColor"/>
      <circle cx="64" cy="96" r="4" 
              fill="currentColor"/>
    </svg>
  );
};

export default SettingsIcon;
