'use client';

import React, { useEffect, useState } from 'react';

const PhoneIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Show after 300px, but hide when reaching the footer near the bottom
      const isNearBottom = (scrollY + windowHeight) > (documentHeight - 300);
      
      if (scrollY > 300 && !isNearBottom) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '15px',
      right: '15px',
      zIndex: 2000,
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      transform: visible ? 'translateY(0) scale(1)' : 'translateY(100px) scale(0.8)',
      opacity: visible ? 1 : 0,
      pointerEvents: visible ? 'auto' : 'none'
    }}>
      <a href="tel:+48572272930" className="btn-power floating-btn-massive" style={{
        width: '100%',
        fontSize: '2rem',
        padding: '24px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 10px 40px rgba(220, 38, 38, 0.4), 0 6px 0 var(--secondary)',
        borderRadius: '20px'
      }}>
        <div className="animate-pulse" style={{ display: 'flex', marginRight: '16px' }}>
          <PhoneIcon size={36} />
        </div>
        <span className="cta-phone-number" style={{ fontWeight: 950 }}>572 272 930</span>
      </a>

      <style jsx global>{`
        @media (min-width: 769px) {
          div[style*="fixed"] { display: none !important; }
        }
      `}</style>
    </div>
  );
}
