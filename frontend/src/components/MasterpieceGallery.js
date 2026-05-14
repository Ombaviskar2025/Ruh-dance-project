import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LuPlay } from 'react-icons/lu';
import './MasterpieceGallery.css';

const MasterpieceGallery = () => {
  const [signatures, setSignatures] = useState([]);

  useEffect(() => {
    const fetchSignatures = async () => {
      try {
        const res = await axios.get('https://ruh-dance-project.onrender.com/api/signatures');
        if (res.data.success && res.data.data.length > 0) {
          setSignatures(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch signature performances", err);
      }
    };
    fetchSignatures();
  }, []);

  // Use dynamic data or helpful placeholders if empty
  const displayItems = signatures.length > 0 ? signatures : [
    { title: "No Signature Found", description: "Add photos in Admin Dashboard -> Screen photo", image: "https://picsum.photos/id/1018/600/800" },
    { title: "Setup Gallery", description: "Configure your gallery via Admin Panel", image: "https://picsum.photos/id/1015/600/800" },
    { title: "Infinite Style", description: "3D Circular Gallery active", image: "https://picsum.photos/id/1019/600/800" },
  ];

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
