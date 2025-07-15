
// Utility functions
const validateUrl = (url) => {
  try {
    const urlPattern = /^(https?:\/\/)[\w.-]+\.[a-zA-Z]{2,}(\/[^\s]*)?$/;
    return urlPattern.test(url) || new URL(url).href.length > 0;
  } catch {
    return false;
  }
};

const validateCustomCode = (code) => {
  if (code.length === 0) return true; // Optional field
  const codePattern = /^[a-zA-Z0-9_-]{3,20}$/;
  return codePattern.test(code);
};

const validateValidityPeriod = (period) => {
  return Number.isInteger(period) && period > 0 && period <= 525600; // Max 1 year in minutes
};

// Icons as SVG components
const LinkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12,6 12,12 16,14" />
  </svg>
);

const CodeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="16,18 22,12 16,6" />
    <polyline points="8,6 2,12 8,18" />
  </svg>
);

const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const URLInputForm = ({ 
  urlItems, 
  setUrlItems, 
  validationErrors, 
  setValidationErrors 
}) => {
  const updateUrlItem = (id, field, value) => {
    setUrlItems(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
    
    // Clear validation error when user starts typing
    if (validationErrors[`${id}-${field}`]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`${id}-${field}`];
        return newErrors;
      });
    }
  };

  const removeUrlItem = (id) => {
    setUrlItems(prev => prev.filter(item => item.id !== id));
    // Clean up validation errors for removed item
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith(id)) {
          delete newErrors[key];
        }
      });
      return newErrors;
    });
  };

  const addUrlItem = () => {
    if (urlItems.length < 5) {
      const newItem = {
        id: Math.random().toString(36).substr(2, 9),
        originalUrl: '',
        customCode: '',
        validityPeriod: 30,
      };
      setUrlItems(prev => [...prev, newItem]);
    }
  };

  const validateField = (id, field, value) => {
    let error = '';
    
    switch (field) {
      case 'originalUrl':
        if (!value || !validateUrl(value)) {
          error = 'Please enter a valid URL';
        }
        break;
      case 'customCode':
        if (value && !validateCustomCode(value)) {
          error = 'Custom code must be 3-20 characters (letters, numbers, _, -)';
        }
        break;
      case 'validityPeriod':
        if (!validateValidityPeriod(value)) {
          error = 'Validity period must be a positive integer (max 525600 minutes)';
        }
        break;
    }
    
    if (error) {
      setValidationErrors(prev => ({ ...prev, [`${id}-${field}`]: error }));
    }
  };

  return (
    <div className="url-form-container">
      {urlItems.map((item, index) => (
        <div key={item.id} className="url-item">
          <div className="url-item-header">
            <h3 className="url-item-title">
              URL #{index + 1}
            </h3>
            {urlItems.length > 1 && (
              <button
                onClick={() => removeUrlItem(item.id)}
                className="remove-button"
                aria-label="Remove URL"
              >
                <XIcon />
              </button>
            )}
          </div>

          <div className="form-fields">
            {/* Original URL Input */}
            <div className="form-group">
              <label className="form-label">
                <LinkIcon />
                Original URL *
              </label>
              <input
                type="url"
                value={item.originalUrl}
                onChange={(e) => updateUrlItem(item.id, 'originalUrl', e.target.value)}
                onBlur={(e) => validateField(item.id, 'originalUrl', e.target.value)}
                placeholder="https://example.com/very-long-url"
                className={`form-input ${
                  validationErrors[`${item.id}-originalUrl`] ? 'error' : ''
                }`}
              />
              {validationErrors[`${item.id}-originalUrl`] && (
                <p className="error-message">
                  {validationErrors[`${item.id}-originalUrl`]}
                </p>
              )}
            </div>

            <div className="form-grid">
              {/* Custom Code Input */}
              <div className="form-group">
                <label className="form-label">
                  <CodeIcon />
                  Custom Code (Optional)
                </label>
                <input
                  type="text"
                  value={item.customCode}
                  onChange={(e) => updateUrlItem(item.id, 'customCode', e.target.value)}
                  onBlur={(e) => validateField(item.id, 'customCode', e.target.value)}
                  placeholder="my-link"
                  className={`form-input ${
                    validationErrors[`${item.id}-customCode`] ? 'error' : ''
                  }`}
                />
                {validationErrors[`${item.id}-customCode`] && (
                  <p className="error-message">
                    {validationErrors[`${item.id}-customCode`]}
                  </p>
                )}
              </div>

              {/* Validity Period Input */}
              <div className="form-group">
                <label className="form-label">
                  <ClockIcon />
                  Validity (Minutes)
                </label>
                <input
                  type="number"
                  value={item.validityPeriod}
                  onChange={(e) => updateUrlItem(item.id, 'validityPeriod', parseInt(e.target.value) || 30)}
                  onBlur={(e) => validateField(item.id, 'validityPeriod', parseInt(e.target.value) || 30)}
                  min="1"
                  max="525600"
                  className={`form-input ${
                    validationErrors[`${item.id}-validityPeriod`] ? 'error' : ''
                  }`}
                />
                {validationErrors[`${item.id}-validityPeriod`] && (
                  <p className="error-message">
                    {validationErrors[`${item.id}-validityPeriod`]}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Add URL Button */}
      {urlItems.length < 5 && (
        <button onClick={addUrlItem} className="add-url-button">
          + Add Another URL ({urlItems.length}/5)
        </button>
      )}
    </div>
  );
};

export default URLInputForm;