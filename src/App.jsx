import { useState } from 'react';
import Header from './components/Header';
import URLInputForm from './components/URLInputForm';
import ActionButtons from './components/ActionButtons';
import ResultsDisplay from './components/ResultsDisplay';
import './App.css';

// Utility functions
const validateUrl = (url) => {
  try {
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
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

const generateShortCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

function App() {
  const [urlItems, setUrlItems] = useState([
    {
      id: Math.random().toString(36).substr(2, 9),
      originalUrl: '',
      customCode: '',
      validityPeriod: 30,
    }
  ]);

  const [validationErrors, setValidationErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  const validateAllFields = () => {
    const errors = {};
    let hasErrors = false;

    urlItems.forEach(item => {
      if (!item.originalUrl || !validateUrl(item.originalUrl)) {
        errors[`${item.id}-originalUrl`] = 'Please enter a valid URL';
        hasErrors = true;
      }

      if (item.customCode && !validateCustomCode(item.customCode)) {
        errors[`${item.id}-customCode`] = 'Custom code must be 3-20 characters (letters, numbers, _, -)';
        hasErrors = true;
      }

      if (!validateValidityPeriod(item.validityPeriod)) {
        errors[`${item.id}-validityPeriod`] = 'Validity period must be a positive integer';
        hasErrors = true;
      }
    });

    setValidationErrors(errors);
    return !hasErrors;
  };

  const handleShortenUrls = async () => {
    if (!validateAllFields()) {
      return;
    }

    setIsProcessing(true);

    // Simulate API processing with delay
    const processUrl = async (item) => {
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
      
      const shortCode = item.customCode || generateShortCode();
      const expiryDate = new Date(Date.now() + item.validityPeriod * 60 * 1000);
      
      return {
        ...item,
        shortenedUrl: `https://short.ly/${shortCode}`,
        expiryDate,
        isProcessing: false,
      };
    };

    try {
      // Set all items as processing
      setUrlItems(prev => prev.map(item => ({ ...item, isProcessing: true })));

      // Process all URLs concurrently
      const processedItems = await Promise.all(
        urlItems.map(item => processUrl(item))
      );

      setUrlItems(processedItems);
    } catch (error) {
      console.error('Error processing URLs:', error);
      setUrlItems(prev => prev.map(item => ({ 
        ...item, 
        isProcessing: false,
        error: 'Failed to shorten URL'
      })));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setUrlItems([{
      id: Math.random().toString(36).substr(2, 9),
      originalUrl: '',
      customCode: '',
      validityPeriod: 30,
    }]);
    setValidationErrors({});
  };

  const hasValidUrls = urlItems.some(item => item.originalUrl.trim() !== '');
  const hasResults = urlItems.some(item => item.shortenedUrl);

  return (
    <div className="app-container">
      <div className="main-content">
        <Header />
        
        <URLInputForm 
          urlItems={urlItems}
          setUrlItems={setUrlItems}
          validationErrors={validationErrors}
          setValidationErrors={setValidationErrors}
        />
        
        <ActionButtons 
          onShortenUrls={handleShortenUrls}
          onReset={handleReset}
          hasValidUrls={hasValidUrls}
          isProcessing={isProcessing}
          hasResults={hasResults}
        />
        
        <ResultsDisplay urlItems={urlItems} />
      </div>
    </div>
  );
}

export default App;