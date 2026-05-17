import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { LuPause, LuPlay, LuVolumeX, LuVolume2 } from 'react-icons/lu';
import '../App.css';
import MasterpieceGallery from '../components/MasterpieceGallery';
import GurusSection from '../components/GurusSection';
import { resolveMediaUrl } from '../utils/media';

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '', phone: '', gender: '', age: '', danceStyle: '', email:'', interest:'', message:''
  });
  
  // Default fallback video URL
  const defaultVideoUrl = 'https://cdn.pixabay.com/video/2021/08/11/84687-587889617_tiny.mp4';
  const [homeVideoUrl, setHomeVideoUrl] = useState(defaultVideoUrl);

  const isYouTube = (url) => url && (url.includes('youtube.com') || url.includes('youtu.be'));
  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // 1. Video Control State
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');

  // 1. Cursor Glow State
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 2. Scroll Animation Observer
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('scroll-active');
        }
      });
    }, { threshold: 0.15 });

    const hiddenElements = document.querySelectorAll('.scroll-reveal');
    hiddenElements.forEach((el) => observerRef.current.observe(el));

    // Fetch admin-configured background video URL
    const fetchVideoSettings = async () => {
      try {
        const res = await axios.get('https://ruh-dance-project.onrender.com/api/settings');
        if (res.data.success && res.data.data.homeVideoUrl) {
          setHomeVideoUrl(res.data.data.homeVideoUrl);
        }
      } catch (err) {
        console.log('Using default video URL');
      }
    };
    fetchVideoSettings();

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  // 4. Video Time Listeners (Re-attached on video URL/key changes)
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleTimeUpdate = () => {
        setCurrentTime(formatTime(video.currentTime));
      };
      const handleMetaData = () => {
        setDuration(formatTime(video.duration));
      };
      
      // If metadata is already loaded (e.g. from cache or slow effect run)
      if (video.readyState >= 1) {
        setDuration(formatTime(video.duration));
      }

      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('loadedmetadata', handleMetaData);
      video.addEventListener('durationchange', handleMetaData);
      
      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('loadedmetadata', handleMetaData);
        video.removeEventListener('durationchange', handleMetaData);
      };
    }
  }, [homeVideoUrl]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://ruh-dance-project.onrender.com/api/inquiries', formData);
      alert('Your soul has spoken, inquiry sent successfully !!');
      setFormData({ fullName: '', phone: '', gender: '', age: '', danceStyle: '' , email: '', interest: '',message: '' });
      setShowModal(false);
    } catch (err) {
      alert('Submission failed. Please try again.');
    }
  };

  return (
    <div className="home-content-wrapper">
      {/* 3. Cursor Glow Element */}
      <div 
        className="cursor-glow" 
        style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}
      ></div>

      {/* 4. Cinematic Fullscreen Video Header */}
      <div className="cinematic-hero-video-section fade-in">
        {isYouTube(homeVideoUrl) ? (
          <iframe
            className="cinematic-bg-video"
            src={`https://www.youtube.com/embed/${getYouTubeId(homeVideoUrl)}?autoplay=1&mute=1&controls=0&loop=1&playlist=${getYouTubeId(homeVideoUrl)}&playsinline=1`}
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            style={{ pointerEvents: 'none', width: '100%', height: '150%', objectFit: 'cover' }}
          ></iframe>
        ) : (
          <video 
            ref={videoRef}
            key={homeVideoUrl} 
            className="cinematic-bg-video" 
            autoPlay 
            loop 
            muted 
            playsInline
          >
            <source src={resolveMediaUrl(homeVideoUrl)} />
          </video>
        )}
        <div className="cinematic-video-overlay-gradient"></div>
        
        <div className="cinematic-titles-overlay">
          <h1 className="cinematic-main-title">RUH</h1>
          <h3 className="cinematic-sub-title">DANCE PRODUCTION</h3>
          
          <div className="cinematic-buttons-row">
            <button className="cinematic-btn primary-pink" onClick={() => setShowModal(true)}>Join Now</button>
          </div>
        </div>

        <div className="cinematic-controls-overlay">
           <div className="control-left" onClick={togglePlayPause}>
             {isPlaying ? <LuPause className="control-icon" /> : <LuPlay className="control-icon" />}
             <span className="control-time">{currentTime} / {duration}</span>
           </div>
           <div className="control-right" onClick={toggleMute}>
             {isMuted ? <LuVolumeX className="control-icon" /> : <LuVolume2 className="control-icon" />}
           </div>
        </div>
      </div>

      {/* Masterpieces Graphic Section */}
      <div className="scroll-reveal" style={{ marginTop: '40px' }}>
        <MasterpieceGallery />
      </div>

      <div className="scroll-reveal">
        <GurusSection />
      </div>

      {/* Infinite Scrolling Marquee */}
      <div className="marquee-container scroll-reveal">
        <div className="marquee-content">
          <span className="marquee-item">Semi-Classical</span>
          <span className="marquee-item accent">❖</span>
          <span className="marquee-item">Ballet</span>
          <span className="marquee-item accent">❖</span>
          <span className="marquee-item">Bollywood</span>
          <span className="marquee-item accent">❖</span>
          <span className="marquee-item">Hip-Hop</span>
          <span className="marquee-item accent">❖</span>
          <span className="marquee-item">Contemporary</span>
          <span className="marquee-item accent">❖</span>
          {/* Duplicate for infinite loop effect */}
          <span className="marquee-item">Semi-Classical</span>
          <span className="marquee-item accent">❖</span>
          <span className="marquee-item">Ballet</span>
          <span className="marquee-item accent">❖</span>
          <span className="marquee-item">Bollywood</span>
          <span className="marquee-item accent">❖</span>
          <span className="marquee-item">Hip-Hop</span>
          <span className="marquee-item accent">❖</span>
          <span className="marquee-item">Contemporary</span>
          <span className="marquee-item accent">❖</span>
        </div>
      </div>

      {/* Glassmorphic Hero Section with Video Background */}
      <div className="modern-hero-wrapper scroll-reveal">
        {/* Ambient Floating Elements */}
        <div className="aesthetic-shape shape-1"></div>
        <div className="aesthetic-shape shape-2"></div>
        <div className="aesthetic-shape shape-3"></div>

        {/* Video Background Layer */}
        <div className="hero-video-container">
          {isYouTube(homeVideoUrl) ? (
            <iframe
              className="hero-bg-video"
              src={`https://www.youtube.com/embed/${getYouTubeId(homeVideoUrl)}?autoplay=1&mute=1&controls=0&loop=1&playlist=${getYouTubeId(homeVideoUrl)}&playsinline=1`}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              style={{ pointerEvents: 'none', width: '100%', height: '150%', objectFit: 'cover' }}
            ></iframe>
          ) : (
            <video key={homeVideoUrl} autoPlay loop muted playsInline className="hero-bg-video">
              <source src={resolveMediaUrl(homeVideoUrl)} />
            </video>
          )}
          <div className="video-overlay"></div>
        </div>

        <div className="glass-hero-panel hover-3d-card">
          <h2 className="hero-title-modern">Where Classical <br/> Meets Modern Expression</h2>
          <p className="hero-desc-modern">
            Blending timeless traditions with contemporary innovation to create a language that transcends words.
          </p>
          <button className="modern-btn animated-gradient-btn" onClick={() => setShowModal(true)}>
            Begin Your Journey →
          </button>
        </div>
      </div>

      {/* Modern Glass Inquiry Modal */}
      {showModal && (
        <div className="modern-modal-overlay">
          <div className="modern-modal-content">
            <button className="modern-close-btn" onClick={() => setShowModal(false)}>&times;</button>
            <h3>Join the Journey</h3>

            <form onSubmit={handleSubmit} className="inquiry-form">
              <input type="text" placeholder="Full Name" required 
               value={formData.fullName} 
               onChange={(e) => setFormData({...formData, fullName: e.target.value})} 
               className="modern-form-input"
              />
              <input 
              type="tel" placeholder="Phone Number" required 
              value={formData.phone} 
              onChange={(e) => setFormData({...formData, phone: e.target.value})} 
              className="modern-form-input"
              />
  
            <div className="modern-form-row">
              <select 
              required value={formData.gender} 
              onChange={(e) => setFormData({...formData, gender: e.target.value})}
              className="modern-form-select"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
    
              <input 
                type="number" placeholder="Age" required 
                value={formData.age} 
                onChange={(e) => setFormData({...formData, age: e.target.value})} 
                className="modern-form-input"
              />
            </div>

            <select 
              required value={formData.danceStyle} 
              onChange={(e) => setFormData({...formData, danceStyle: e.target.value})}
              className="modern-form-select"
            >
              <option value="">Select Dance Style</option>
              <option value="semi-classical">Semi-Classical</option>
              <option value="ballet">Ballet</option>
              <option value="bollywood">Bollywood</option>
              <option value="hip-hop">Hip-Hop</option>
              <option value="contemporary">Contemporary</option>
            </select>

            <input 
              type="email" placeholder="Email" required 
              value={formData.email} 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
              className="modern-form-input"
            />

            <select 
              required 
              value={formData.interest} 
              onChange={(e) => setFormData({...formData, interest: e.target.value})}
              className="modern-form-select"
            >
              <option value="">What are you interested in?</option>
              <option value="Education">Education</option>
              <option value="Sangeet Choreography">Sangeet Choreography</option>
              <option value="Dance Production">Dance Production</option>
              <option value="Healing Workshop">Healing Workshop</option>
            </select>

            <input 
              type="text" placeholder="Message" required 
              value={formData.message} 
              onChange={(e) => setFormData({...formData, message: e.target.value})} 
              className="modern-form-input"
            />

            <button type="submit" className="modern-btn animated-gradient-btn" style={{ width: '100%', marginTop: '10px' }}>
              Submit Inquiry
            </button>
          </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;