'use client';

import { useState, useEffect } from 'react';

/**
 * CookieConsent component provides a simple banner for users to accept cookies.
 * It uses localStorage to remember the user's choice.
 */
export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Delay visibility slightly for better UX/entrance effect
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptConsent = () => {
    localStorage.setItem('cookie-consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-banner-wrapper">
      <div className="cookie-banner-container">
        <div className="cookie-banner-content">
          <div className="cookie-icon-wrapper">
            <span className="cookie-icon">🛡️</span>
          </div>
          <div className="cookie-text">
            <p>
              Strona <strong>LAWECIARZ.PRO</strong> wykorzystuje pliki cookie w celu zapewnienia prawidłowego działania oraz poprawy jakości świadczonych usług.
            </p>
          </div>
          <div className="cookie-actions">
            <button 
              onClick={acceptConsent} 
              className="btn-power btn-cookie"
              aria-label="Akceptuj pliki cookie"
            >
              Rozumiem
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
