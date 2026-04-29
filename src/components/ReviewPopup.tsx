'use client';

import React, { useState, useEffect } from 'react';

interface Review {
  name: string;
  city: string;
  text: string;
  rating: number;
}

const REVIEWS: Review[] = [
  {
    name: "Tomasz Kowalski",
    city: "Warszawa",
    text: "Szybki dojazd i profesjonalna pomoc. Polecam każdemu w potrzebie!",
    rating: 5
  },
  {
    name: "Marek Nowak",
    city: "Lublin",
    text: "Najlepsza pomoc drogowa w okolicy. Tanio, solidnie i bardzo uprzejmie.",
    rating: 5
  },
  {
    name: "Anna Wiśniewska",
    city: "Radom",
    text: "Bardzo miły kierowca, auto bezpiecznie dowiezione do serwisu. Pełen profesjonalizm.",
    rating: 5
  },
  {
    name: "Piotr Zieliński",
    city: "Siedlce",
    text: "Pomoc przyszła w niecałe 20 minut. Uratowali mi dzień, dziękuję!",
    rating: 5
  },
  {
    name: "Krzysztof Mazur",
    city: "Mińsk Mazowiecki",
    text: "Konkurencyjne ceny i świetny kontakt. Laweta przyjechała błyskawicznie.",
    rating: 5
  }
];

export default function ReviewPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detectedCity, setDetectedCity] = useState<string | null>(null);

  useEffect(() => {
    // Check for detected city in DOM metadata (set in [slug]/page.tsx)
    const meta = document.getElementById('page-metadata');
    if (meta) {
      const city = meta.getAttribute('data-city');
      if (city && city !== 'Cała Polska') {
        setDetectedCity(city);
      }
    }

    // Check if already dismissed and if it has expired (7 days)
    const dismissedAt = localStorage.getItem('reviewPopupDismissedAt');
    if (dismissedAt) {
      const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
      const now = Date.now();
      if (now - parseInt(dismissedAt) < sevenDaysInMs) {
        setIsDismissed(true);
        return;
      } else {
        localStorage.removeItem('reviewPopupDismissedAt');
      }
    }

    // Delay showing the popup (5.5 seconds)
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 11500);

    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (isDismissed || isModalOpen || !isVisible) return;

    // Rotate reviews every 12 seconds
    const rotateTimer = setInterval(() => {
      setCurrentReviewIndex((prev) => (prev + 1) % REVIEWS.length);
    }, 12000);

    return () => clearInterval(rotateTimer);
  }, [isDismissed, isModalOpen, isVisible]);

  const handleDismissLogic = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('reviewPopupDismissedAt', Date.now().toString());
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleDismissLogic();
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    handleDismissLogic();
  };

  if (isDismissed || !isVisible) return null;

  const currentReview = REVIEWS[currentReviewIndex];
  // Use detected city if available, otherwise fallback to the one in the review object
  const cityToShow = detectedCity || currentReview.city;
  const initials = currentReview.name.split(' ').map(n => n[0]).join('');

  return (
    <>
      {/* Floating Badge */}
      <div className="review-popup-badge" onClick={openModal}>
        <div className="live-dot" />
        <div className="review-avatar">{initials}</div>
        <div className="review-info">
          <span className="review-name">{currentReview.name} z {cityToShow}</span>
          <span className="review-location">Właśnie wystawił opinię</span>
          <div className="review-stars">
            {[...Array(currentReview.rating)].map((_, i) => (
              <span key={i}>★</span>
            ))}
          </div>
        </div>
        <div className="close-popup" onClick={handleDismiss} title="Zamknij na stałe">✕</div>
      </div>

      {/* Detail Modal */}
      {isModalOpen && (
        <div className="review-modal-overlay" onClick={closeModal}>
          <div className="review-modal" onClick={(e) => e.stopPropagation()}>
            <button className="review-modal-close" onClick={closeModal}>✕</button>
            <div className="review-modal-content">
              <div className="review-modal-avatar">{initials}</div>
              <h4 className="review-modal-name">{currentReview.name}</h4>
              <p className="review-modal-location">{cityToShow}</p>
              <div className="review-stars" style={{ fontSize: '16px', gap: '4px' }}>
                {[...Array(currentReview.rating)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <p className="review-modal-text">"{currentReview.text}"</p>
              <div className="badge-live" style={{ background: '#f1f5f9', color: '#64748b', fontSize: '10px' }}>
                Zweryfikowana opinia
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
