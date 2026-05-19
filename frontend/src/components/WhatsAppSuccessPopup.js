import React, { useEffect } from 'react';
import './WhatsAppSuccessPopup.css';

const WhatsAppSuccessPopup = ({ 
  isOpen, 
  onClose, 
  title = 'Success!', 
  subtitle = 'Action completed successfully.',
  details = {},
  whatsappMessage = '',
  whatsappPhone = '9822202239',
  buttonText = 'Confirm on WhatsApp'
}) => {
  useEffect(() => {
    if (isOpen) {
      // Prevent body scrolling when popup is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleWhatsAppRedirect = () => {
    const cleanPhone = whatsappPhone.replace(/\D/g, '');
    const waUrl = `https://wa.me/${cleanPhone || '9822202239'}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(waUrl, '_blank');
    if (onClose) onClose();
  };

  return (
    <div className="whatsapp-popup-overlay">
      <div className="whatsapp-popup-card">
        {/* Animated Celebration Sparkles */}
        <div className="popup-sparkle sparkle-1">✨</div>
        <div className="popup-sparkle sparkle-2">🎈</div>
        <div className="popup-sparkle sparkle-3">💃</div>
        <div className="popup-sparkle sparkle-4">✨</div>

        <button className="popup-close-btn" onClick={onClose}>&times;</button>
        
        {/* Glowing Animated Success Checkmark */}
        <div className="success-checkmark-wrapper">
          <div className="success-checkmark-circle"></div>
          <div className="success-checkmark-stem"></div>
          <div className="success-checkmark-kick"></div>
        </div>

        <h2 className="popup-title">{title}</h2>
        <p className="popup-subtitle">{subtitle}</p>

        {/* Dynamic Details Box */}
        {Object.keys(details).length > 0 && (
          <div className="popup-details-box">
            {Object.entries(details).map(([key, val]) => (
              <div key={key} className="popup-details-row">
                <span className="popup-details-label">{key}:</span>
                <span className="popup-details-value">{val}</span>
              </div>
            ))}
          </div>
        )}

        <div className="popup-welcome-badge">
          <span>Official Ruh Dance Confirmation</span>
        </div>

        {/* WhatsApp Pulsating Redirect Button */}
        <button 
          className="popup-whatsapp-btn"
          onClick={handleWhatsAppRedirect}
        >
          <svg viewBox="0 0 24 24" className="whatsapp-btn-icon">
            <path fill="currentColor" d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.455L0 24zm6.59-4.846c1.66.986 3.284 1.447 4.96 1.448 5.505 0 9.982-4.475 9.985-9.98.002-2.67-1.025-5.18-2.888-7.047C16.84 1.7 14.33.67 11.666.67c-5.513 0-9.99 4.476-9.993 9.982-.001 1.764.473 3.42 1.385 4.887l-.953 3.477 3.552-.932zm13.176-7.37c-.36-.18-2.127-1.05-2.456-1.17-.33-.12-.57-.18-.81.18-.24.36-.93 1.17-1.14 1.41-.21.24-.42.27-.78.09-.36-.18-1.52-.56-2.896-1.787-1.077-.96-1.802-2.15-2.013-2.51-.21-.36-.02-.56.16-.74.16-.16.36-.42.54-.63.18-.21.24-.36.36-.6.12-.24.06-.45-.03-.63-.09-.18-.81-1.95-1.11-2.67-.3-.72-.6-1.2-.81-1.21h-.69c-.24 0-.63.09-.96.45-.33.36-1.26 1.23-1.26 3.01 0 1.78 1.3 3.51 1.48 3.75.18.24 2.55 3.9 6.19 5.48.86.37 1.54.6 2.06.77.87.28 1.66.24 2.28.15.7-.1 2.13-.87 2.43-1.72.3-.85.3-1.57.21-1.72-.09-.15-.33-.24-.69-.42z"/>
          </svg>
          {buttonText}
        </button>

        <p className="popup-footer-text">Clicking will open WhatsApp in a new tab with your prefilled details.</p>
      </div>
    </div>
  );
};

export default WhatsAppSuccessPopup;
