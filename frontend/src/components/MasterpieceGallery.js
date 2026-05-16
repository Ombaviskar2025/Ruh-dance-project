import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LuPlay } from 'react-icons/lu';
import './MasterpieceGallery.css';

const MasterpieceGallery = () => {
  const [displayItems, setDisplayItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fallback images in case the database is empty or API fails
  const fallbackItems = [
    { title: "Divine Expression", description: "Classical Bharatanatyam mudras", image: "https://images.unsplash.com/photo-1542614471-001ccf2bb6e1?q=80&w=800&auto=format&fit=crop" },
    { title: "Cultural Heritage", description: "Preserving traditions in motion", image: "https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?q=80&w=800&auto=format&fit=crop" },
    { title: "Artistic Elegance", description: "The beautiful art of storytelling through dance", image: "https://images.unsplash.com/photo-1533147670608-2a2f9775d3a4?q=80&w=800&auto=format&fit=crop" },
  ];

  useEffect(() => {
    const fetchSignatures = async () => {
      try {
        const response = await axios.get('https://ruh-dance-project.onrender.com/api/signatures');
        // Unpack the data correctly based on backend response format
        const fetchedData = response.data.data || response.data;
        
        if (Array.isArray(fetchedData) && fetchedData.length > 0) {
          setDisplayItems(fetchedData);
        } else {
          setDisplayItems(fallbackItems);
        }
      } catch (error) {
        console.error('Failed to fetch signatures:', error);
        setDisplayItems(fallbackItems);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSignatures();
  }, []);

  const handleCardClick = (sig) => {
    if (sig.videoUrl) {
      const fullUrl = sig.videoUrl.startsWith('http') ? sig.videoUrl : `https://ruh-dance-project.onrender.com${sig.videoUrl}`;
      window.open(fullUrl, '_blank');
    }
  };

  return (
    <div className="masterpiece-wrapper">
      <div className="ambient-orb orb-1"></div>
      <div className="ambient-orb orb-2"></div>
      
      <div className="masterpiece-section">
        <h2 className="masterpiece-title">Signature Performances</h2>
        
        <div className="gallery-viewport">
          <div className="gallery-ring">
            {displayItems.map((sig, index) => (
              <div 
                key={sig._id || index} 
                className={`gallery-card ${sig.videoUrl ? 'has-video' : ''}`}
                style={{ '--index': index, '--count': displayItems.length }}
                onClick={() => handleCardClick(sig)}
              >
                <div className="card-content">
                  {sig.videoUrl ? (
                    <video 
                      src={sig.videoUrl.startsWith('http') ? sig.videoUrl : `https://ruh-dance-project.onrender.com${sig.videoUrl}`}
                      autoPlay 
                      loop 
                      muted 
                      playsInline
                      poster={sig.image?.startsWith('http') ? sig.image : (sig.image ? `https://ruh-dance-project.onrender.com${sig.image}` : '')}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : sig.image ? (
                    <img 
                      src={sig.image?.startsWith('http') ? sig.image : `https://ruh-dance-project.onrender.com${sig.image}`} 
                      alt={sig.title} 
                    />
                  ) : (
                    <div className="placeholder-image">
                       <LuPlay size={50} style={{ color: 'white', opacity: 0.5 }} />
                    </div>
                  )}
                  <div className="card-info-overlay">
                    <h4>{sig.title}</h4>
                    <p>{sig.description}</p>
                    {sig.videoUrl && (
                       <span className="video-hint">Click to watch video →</span>
                    )}
                  </div>
                </div>
                <div className="card-reflection"></div>
              </div>
            ))}
          </div>
        </div>
        
        <p className="masterpiece-subtitle text-reveal">
          A glimpse into our breathtaking choreography and award-winning productions.
        </p>
      </div>
    </div>
  );
};

export default MasterpieceGallery;
