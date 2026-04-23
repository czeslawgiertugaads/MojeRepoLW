'use client';

import React, { useState, useEffect } from 'react';

export default function TowTruckLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a short loading time for dramatic effect, then hide
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2800); // 2.8s is enough to show the animation
    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: 'var(--background)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    }}>
      {/* Moving Road Lines */}
      <div className="road-container" style={{
        position: 'absolute',
        width: '200%',
        height: '4px',
        background: 'rgba(0,0,0,0.1)',
        bottom: '40%',
        zIndex: 1
      }}>
        <div className="road-stripes"></div>
      </div>

      {/* Tow Truck Wrapper */}
      <div className="truck-wrapper" style={{ position: 'relative', zIndex: 2 }}>
        <svg width="240" height="120" viewBox="0 0 240 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Main Body (Red) */}
          <path d="M20 90H210V60H160L140 30H40V90H20Z" fill="#dc2626" />
          {/* Windows */}
          <path d="M135 35H45V60H155L135 35Z" fill="#1e293b" opacity="0.8" />
          {/* Wheels */}
          <circle cx="60" cy="95" r="18" fill="#1e293b" />
          <circle cx="60" cy="95" r="8" fill="#94a3b8" />
          <circle cx="170" cy="95" r="18" fill="#1e293b" />
          <circle cx="170" cy="95" r="8" fill="#94a3b8" />
          {/* Speed blur lines */}
          <rect x="-40" y="50" width="30" height="4" rx="2" fill="#dc2626" opacity="0.4" />
          <rect x="-60" y="75" width="40" height="4" rx="2" fill="#dc2626" opacity="0.2" />
        </svg>
        
        {/* Siren Light */}
        <div className="siren" style={{
          position: 'absolute',
          top: '25px',
          left: '120px',
          width: '12px',
          height: '6px',
          background: '#ef4444',
          borderRadius: '2px',
          boxShadow: '0 0 20px #ef4444'
        }}></div>
      </div>

      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <h2 style={{ 
          fontSize: '2rem', 
          fontWeight: 900, 
          color: 'var(--secondary)',
          margin: 0,
          textTransform: 'uppercase',
          letterSpacing: '2px'
        }}>
          POMOC W DRODZE...
        </h2>
        <p style={{ 
          fontSize: '1.2rem', 
          fontWeight: 700, 
          color: 'var(--primary)',
          marginTop: '10px'
        }}>
          MOCNY HOL: JUŻ JEDZIEMY!
        </p>
      </div>

      <style jsx global>{`
        .truck-wrapper {
          animation: truckShake 0.15s ease-in-out infinite, truckDrive 1.5s ease-in-out infinite;
        }
        
        @keyframes truckShake {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }

        @keyframes truckDrive {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(10px); }
        }

        .siren {
          animation: sirenFlash 0.3s steps(2) infinite;
        }

        @keyframes sirenFlash {
          0% { background: #ef4444; box-shadow: 0 0 30px #ef4444; }
          100% { background: #3b82f6; box-shadow: 0 0 30px #3b82f6; }
        }

        .road-stripes {
          position: absolute;
          width: 100%;
          height: 100%;
          background: repeating-linear-gradient(90deg, transparent, transparent 50px, #fff 50px, #fff 100px);
          animation: roadScroll 0.4s linear infinite;
        }

        @keyframes roadScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-100px); }
        }
      `}</style>
    </div>
  );
}
