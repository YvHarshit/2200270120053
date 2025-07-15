// Icons as SVG components
const LinkIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const LoaderIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="loading-spinner">
    <line x1="12" y1="2" x2="12" y2="6" />
    <line x1="12" y1="18" x2="12" y2="22" />
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
    <line x1="2" y1="12" x2="6" y2="12" />
    <line x1="18" y1="12" x2="22" y2="12" />
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
  </svg>
);

const RotateIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="1,4 1,10 7,10" />
    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
  </svg>
);

const ActionButtons = ({ 
  onShortenUrls, 
  onReset, 
  hasValidUrls, 
  isProcessing, 
  hasResults 
}) => {
  return (
    <div className="action-buttons">
      <button
        onClick={onShortenUrls}
        disabled={!hasValidUrls || isProcessing}
        className="primary-button shorten-button"
      >
        {isProcessing ? (
          <>
            <LoaderIcon />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <LinkIcon />
            <span>Shorten URLs</span>
          </>
        )}
      </button>

      {hasResults && (
        <button onClick={onReset} className="primary-button reset-button">
          <RotateIcon />
          <span>Reset</span>
        </button>
      )}
    </div>
  );
};

export default ActionButtons;