import React from 'react';
import './ImageCarousel.css';

const ImageCarousel = () => {
  const images = [
    "https://picsum.photos/id/1025/400/300",
    "https://picsum.photos/id/1043/400/300",
    "https://picsum.photos/id/1062/400/300",
    "https://picsum.photos/id/1069/400/300",
    "https://picsum.photos/id/1074/400/300",
    "https://picsum.photos/id/1084/400/300",
  ];

  return (
    <div className="carousel-wrapper">
      <div className="carousel-track">
        {[...images, ...images].map((src, index) => (
          <div key={index} className="carousel-item">
            <img src={src} alt={`Gallery ${index}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
