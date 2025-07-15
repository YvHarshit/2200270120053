import { useState } from 'react';

// Icons as SVG components
const LinkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15,3 21,3 21,9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const CopyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20,6 9,17 4,12" />
  </svg>
);



const ResultsDisplay = ({urlItems}) => {
  const [copiedStates, setCopiedStates] = useState({});

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates(prev => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [id]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const formatExpiryDate = (date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const hasResults = urlItems.some(item => item.shortenedUrl);

  if (!hasResults) {
    return null;
  }

  return (
    <div className="results-container">
      <h2 className="results-title">Your Shortened URLs</h2>
      
      {urlItems
        .filter(item => item.shortenedUrl)
        .map((item) => (
          <div key={item.id} className="result-card">
            {/* Original URL */}
            <div className="result-item">
              <LinkIcon className="result-icon" />
              <div className="result-details">
                <p className="result-label">Original URL</p>
                <p className="result-value">{item.originalUrl}</p>
              </div>
            </div>

            {/* Shortened URL */}
            <div className="shortened-url-container">
              <ExternalLinkIcon className="result-icon shortened-url-icon" />
              <div className="result-details shortened-url-details">
                <p className="result-label shortened-url-label">Shortened URL</p>
                <p className="result-value shortened-url-value">
                  {item.shortenedUrl}
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(item.shortenedUrl, item.id)}
                className={`copy-button ${copiedStates[item.id] ? 'copied' : 'default'}`}
              >
                {copiedStates[item.id] ? (
                  <>
                    <CheckIcon />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <CopyIcon />
                    <span className="copy-text">Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Expiry Information */}
            {item.expiryDate && (
              <div className="result-item">
                <CalendarIcon className="result-icon" />
                <div className="result-details">
                  <span className="result-label">Expires: </span>
                  <span className="result-value">
                    {formatExpiryDate(item.expiryDate)}
                  </span>
                </div>
              </div>
            )}

            {/* Custom Code Information */}
            {item.customCode && (
              <div className="result-item">
                <div className="result-icon" style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}>
                  #
                </div>
                <div className="result-details">
                  <span className="result-label">Custom Code: </span>
                  <span className="result-value" style={{ fontFamily: 'Courier New, monospace' }}>
                    {item.customCode}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

export default ResultsDisplay;