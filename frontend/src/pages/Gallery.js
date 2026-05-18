import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LuPlay } from 'react-icons/lu';
import './Gallery.css';
import { resolveMediaUrl } from '../utils/media';

const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await axios.get('https://ruh-dance-project.onrender.com/api/gallery');
        if (res.data.success) {
          setGalleryItems(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch gallery", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const handleMediaClick = (item) => {
    if (item.type === 'video' && item.mediaUrl) {
      window.open(item.mediaUrl, '_blank');
    }
  };

  return (
    <div className="gallery-page-container">
      {/* Ambient Backgrounds */}
      <div className="ambient-orb orb-1"></div>
      <div className="ambient-orb orb-2"></div>
      
      <header className="gallery-header text-reveal">
        <h1 className="gallery-title">Our Gallery</h1>
        <p className="gallery-subtitle">A collection of memories, performances, and art.</p>
      </header>

      {loading ? (
        <div className="loading-spinner" style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Loading...</div>
      ) : (
        <div className="gallery-grid">
          {galleryItems.length > 0 ? (
            galleryItems.map((item) => (
              <div 
                key={item._id} 
                className={`gallery-card-ui ${item.type === 'video' ? 'video-card' : ''}`}
                onClick={() => handleMediaClick(item)}
              >
                <div className="media-wrapper">
                  {item.type === 'video' ? (
                    <video 
                      src={resolveMediaUrl(item.mediaUrl)} 
                      loop 
                      muted 
                      playsInline 
                      preload="metadata"
                      onMouseEnter={(e) => e.target.play().catch(() => {})}
                      onMouseLeave={(e) => e.target.pause()}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  ) : (
                    <img src={resolveMediaUrl(item.mediaUrl)} alt={item.title} loading="lazy" />
                  )}
                  
                  <div className="overlay-content">
                    <h3>{item.title}</h3>
                    {item.description && <p>{item.description}</p>}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-items-message">
              <p>No gallery items found. Admin can add them in the Dashboard.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Gallery;
