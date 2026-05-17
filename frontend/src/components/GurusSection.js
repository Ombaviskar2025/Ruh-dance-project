import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LuInstagram } from 'react-icons/lu';
import './GurusSection.css';
import { resolveMediaUrl } from '../utils/media';

const GurusSection = () => {
  const [gurus, setGurus] = useState([]);
  const [selectedGuru, setSelectedGuru] = useState(null);

  useEffect(() => {
    const fetchGurus = async () => {
      try {
        const res = await axios.get('https://ruh-dance-project.onrender.com/api/gurus');
        setGurus(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch gurus from backend:", err);
      }
    };
    fetchGurus();
  }, []);

  return (
    <div className="gurus-section-wrapper">
      <div className="gurus-header">
        <h2 className="gurus-title">Gurus</h2>
        <p className="gurus-subtitle">
          These are brief profiles of the Gurus who form the bedrock of our productions. Their journeys and passion are a lighthouse, eternally illuminating a path towards the revival of Indian art forms.
        </p>
      </div>

      <div className="gurus-grid">
        {gurus.length > 0 ? (
          gurus.map((guru) => (
            <div 
              key={guru._id} 
              className="guru-card"
            >
              <div className="guru-image-wrapper" onClick={() => setSelectedGuru(guru)}>
                <img 
                  src={resolveMediaUrl(guru.image) || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop'} 
                  alt={guru.name} 
                  className="guru-image" 
                />
                {guru.instagram && (
                  <a href={guru.instagram} target="_blank" rel="noreferrer" className="guru-insta-float" onClick={(e) => e.stopPropagation()}>
                    <LuInstagram />
                  </a>
                )}
              </div>
              <h3 className="guru-name" onClick={() => setSelectedGuru(guru)}>{guru.name}</h3>
              <p className="guru-style">{guru.style}</p>
            </div>
          ))
        ) : (
          <p style={{ color: '#888', fontStyle: 'italic' }}>Gurus will appear here soon.</p>
        )}
      </div>

      {/* Floating Modal for Guru Details */}
      {selectedGuru && (
        <div className="guru-modal-overlay" onClick={() => setSelectedGuru(null)}>
          <div className="guru-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="guru-close-btn" onClick={() => setSelectedGuru(null)}>&times;</button>
            <div className="guru-modal-layout">
              <img 
                 src={resolveMediaUrl(selectedGuru.image) || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop'} 
                 alt={selectedGuru.name} 
                 className="guru-modal-img" 
              />
              <div className="guru-modal-info">
                <h2>{selectedGuru.name}</h2>
                <h4>{selectedGuru.style}</h4>
                <p>{selectedGuru.description}</p>
                {selectedGuru.instagram && (
                  <a href={selectedGuru.instagram} target="_blank" rel="noreferrer" className="modern-btn animated-gradient-btn" style={{marginTop: '20px', display: 'inline-block', textDecoration: 'none'}}>
                    <LuInstagram style={{marginRight: '8px', verticalAlign: 'middle'}}/> Follow on Instagram
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GurusSection;
