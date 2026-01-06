import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import './Masters.css';

const Masters = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [masters, setMasters] = useState([]);
  const [favoriteMasters, setFavoriteMasters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  // Початкові дані майстрів
  const initialMasters = [
    {
      id: 1,
      name: 'Emma Johnson',
      position: 'Senior Stylist',
      image: '/images/masters/katya.png',
      experience: '12 years',
      specialty: 'Color Correction, Balayage',
      galleryCount: 24,
      likes: 128,
      rating: 4.9,
      reviews: 47,
      description: 'Specializes in color transformations and modern balayage techniques.'
    },
    {
      id: 2,
      name: 'Michael Chen',
      position: 'Master Barber',
      image: '/images/masters/michael.jpg',
      experience: '8 years',
      specialty: 'Men\'s Grooming, Fades',
      galleryCount: 18,
      likes: 94,
      rating: 4.8,
      reviews: 32,
      description: 'Expert in classic and modern men\'s hairstyles and grooming.'
    },
    {
      id: 3,
      name: 'Anastasia Fylypiv',
      position: 'Style Director',
      image: '/images/masters/anastasia.png',
      experience: '10 years',
      specialty: 'Color Correction, Extensions',
      galleryCount: 32,
      likes: 156,
      rating: 5.0,
      reviews: 54,
      description: 'Creates cool hairstyles and natural-looking extensions.'
    },
    {
      id: 4,
      name: 'Yurii Propiv',
      position: 'Color Specialist',
      image: '/images/masters/yura.png',
      experience: '7 years',
      specialty: 'Fantasy Colors, Ombre',
      galleryCount: 28,
      likes: 87,
      rating: 4.7,
      reviews: 29,
      description: 'Master of vibrant fantasy colors and seamless ombre transitions.'
    },
    {
      id: 5,
      name: 'Lisa Taylor',
      position: 'Treatment Expert',
      image: '/images/masters/lisa.jpg',
      experience: '9 years',
      specialty: 'Keratin Treatments, Hair Health',
      galleryCount: 15,
      likes: 112,
      rating: 4.9,
      reviews: 38,
      description: 'Focuses on hair health restoration and premium treatments.'
    }
  ];

  // Завантаження даних при монтуванні
  useEffect(() => {
     localStorage.removeItem('hairSalonMasters');
    setIsLoading(true);
    
    try {
      const savedMasters = localStorage.getItem('hairSalonMasters');
      if (savedMasters) {
        const parsedMasters = JSON.parse(savedMasters);
        setMasters(parsedMasters.length > 0 ? parsedMasters : initialMasters);
      } else {
        setMasters(initialMasters);
        localStorage.setItem('hairSalonMasters', JSON.stringify(initialMasters));
      }

      const savedFavorites = localStorage.getItem('favoriteMasters');
      if (savedFavorites) {
        setFavoriteMasters(JSON.parse(savedFavorites));
      } else {
        setFavoriteMasters([]);
        localStorage.setItem('favoriteMasters', JSON.stringify([]));
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setMasters(initialMasters);
      setFavoriteMasters([]);
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  }, []);

  // Статистика
  const totalLikes = masters.length > 0 
    ? masters.reduce((sum, master) => sum + (master.likes || 0), 0)
    : 0;

  const mostLikedMaster = masters.length > 0
    ? masters.reduce((prev, current) => 
        ((prev.likes || 0) > (current.likes || 0)) ? prev : current
      )
    : { name: 'No masters yet', likes: 0 };

  // Функція для лайку
  const handleLikeMaster = (masterId) => {
    const updatedMasters = masters.map(master => {
      if (master.id === masterId) {
        const isLiked = favoriteMasters.includes(masterId);
        const currentLikes = master.likes || 0;
        const newLikes = isLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1;
        
        return {
          ...master,
          likes: newLikes
        };
      }
      return master;
    });

    setMasters(updatedMasters);
    localStorage.setItem('hairSalonMasters', JSON.stringify(updatedMasters));

    let updatedFavorites;
    if (favoriteMasters.includes(masterId)) {
      updatedFavorites = favoriteMasters.filter(id => id !== masterId);
    } else {
      updatedFavorites = [...favoriteMasters, masterId];
    }

    setFavoriteMasters(updatedFavorites);
    localStorage.setItem('favoriteMasters', JSON.stringify(updatedFavorites));
  };

  const isMasterLiked = (masterId) => {
    return favoriteMasters.includes(masterId);
  };

  // Функція для перегляду відгуків
  const handleViewReviews = (masterId) => {
    navigate(`/master/${masterId}/reviews`);
  };

  const handleNext = () => {
    if (masters.length === 0) return;
    setCurrentIndex((prevIndex) => 
      prevIndex === masters.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    if (masters.length === 0) return;
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? masters.length - 1 : prevIndex - 1
    );
  };

  if (isLoading) {
    return (
      <div className="masters-main-page">
        <Header />
        <div className="masters-loading-container">
          <div className="masters-spinner"></div>
          <p>Loading masters...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="masters-main-page">
      <Header />
      
      {/* Герой секція */}
      <section className="masters-hero-section">
        <div className="masters-hero-container">
          <div className="masters-hero-content">
            <h1 className="masters-main-title">Meet Our Masters</h1>
            <p className="masters-hero-subtitle">
              Professional stylists dedicated to creating your perfect look
            </p>
            
            {/* Статистика */}
            {masters.length > 0 && (
              <div className="masters-stats-grid">
                <div className="masters-stat-item">
                  <span className="masters-stat-icon">❤️</span>
                  <span className="masters-stat-value">{totalLikes} total likes</span>
                </div>
                <div className="masters-stat-item">
                  <span className="masters-stat-icon">👑</span>
                  <span className="masters-stat-value">Top: {mostLikedMaster.name}</span>
                </div>
                <div className="masters-stat-item">
                  <span className="masters-stat-icon">⭐</span>
                  <span className="masters-stat-value">{favoriteMasters.length} favorites</span>
                </div>
              </div>
            )}
          </div>

          {/* Карусель */}
          {masters.length > 0 ? (
            <div className="masters-carousel-wrapper">
              <div className="masters-carousel">
                <button className="masters-carousel-btn masters-prev-btn" onClick={handlePrev}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                
                <div className="masters-carousel-track">
                  {masters.map((master, index) => (
                    <div 
                      key={master.id}
                      className={`masters-card ${index === currentIndex ? 'masters-card-active' : ''}`}
                      style={{
                        transform: `translateX(calc(${(index - currentIndex) * 100}% - ${(index - currentIndex) * 30}px))`,
                        opacity: index === currentIndex ? 1 : 0.3,
                        zIndex: index === currentIndex ? 10 : 1
                      }}
                    >
                      <div className="masters-card-image">
                        <div className="masters-image-wrapper">
                          <div className="masters-image-placeholder">
                            {master.image && master.image !== '' ? (
                              <img src={master.image} alt={master.name} onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = `<div class="masters-placeholder-text">${master.name.charAt(0)}</div>`;
                              }} />
                            ) : (
                              <div className="masters-placeholder-text">{master.name.charAt(0)}</div>
                            )}
                          </div>
                          
                          {/* Бейдж лайків */}
                          <div className="masters-likes-badge">
                            <span className="masters-likes-icon">❤️</span>
                            <span className="masters-likes-count">{master.likes || 0}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="masters-card-info">
                        <div className="masters-card-header">
                          <div>
                            <h3 className="masters-card-name">{master.name}</h3>
                            <p className="masters-card-position">{master.position}</p>
                          </div>
                          
                          {/* Кнопка лайку */}
                          <button 
                            className={`masters-like-btn ${isMasterLiked(master.id) ? 'masters-liked' : ''}`}
                            onClick={() => handleLikeMaster(master.id)}
                            aria-label={isMasterLiked(master.id) ? 'Remove from favorites' : 'Add to favorites'}
                          >
                            <svg className="masters-heart-icon" width="24" height="24" viewBox="0 0 24 24" fill={isMasterLiked(master.id) ? "#ff4757" : "none"}>
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
                                stroke={isMasterLiked(master.id) ? "#ff4757" : "#666"} 
                                strokeWidth="2" 
                                fill={isMasterLiked(master.id) ? "#ff4757" : "none"}
                              />
                            </svg>
                            <span className="masters-like-count">{master.likes || 0}</span>
                          </button>
                        </div>
                        
                        <div className="masters-card-details">
                          <div className="masters-detail-item">
                            <span className="masters-detail-icon">⏳</span>
                            <span className="masters-detail-text">{master.experience}</span>
                          </div>
                          <div className="masters-detail-item">
                            <span className="masters-detail-icon">🎯</span>
                            <span className="masters-detail-text">{master.specialty}</span>
                          </div>
                        </div>
                        
                        <p className="masters-card-description">{master.description}</p>
                        
                        {/* Тільки одна кнопка */}
                        <div className="masters-card-actions">
                          <button 
                            className="masters-reviews-btn"
                            onClick={() => handleViewReviews(master.id)}
                          >
                            <span className="masters-btn-icon">💬</span>
                            View Reviews
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button className="masters-carousel-btn masters-next-btn" onClick={handleNext}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              {/* Індикатори */}
              <div className="masters-carousel-indicators">
                {masters.map((_, index) => (
                  <button
                    key={index}
                    className={`masters-indicator ${index === currentIndex ? 'masters-indicator-active' : ''}`}
                    onClick={() => setCurrentIndex(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="masters-empty-state">
              <div className="masters-no-masters">
                <div className="masters-empty-icon">👨‍🎨</div>
                <h3>No Masters Available</h3>
                <p>Check back soon for our professional stylists</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Додаткова інформація */}
      <section className="masters-info-section">
        <div className="masters-info-container">
          <h2 className="masters-section-title">Why Choose Our Masters?</h2>
          
          {masters.length > 0 && (
            <>
              {/* Особливості */}
              <div className="masters-features-grid">
                <div className="masters-feature-card">
                  <div className="masters-feature-icon">🎓</div>
                  <h4>Certified Professionals</h4>
                  <p>All stylists have international certifications and ongoing education</p>
                </div>
                <div className="masters-feature-card">
                  <div className="masters-feature-icon">✨</div>
                  <h4>Latest Techniques</h4>
                  <p>We master the newest trends and innovative hair styling methods</p>
                </div>
                <div className="masters-feature-card">
                  <div className="masters-feature-icon">💖</div>
                  <h4>Personalized Care</h4>
                  <p>Every client receives individual attention and customized service</p>
                </div>
              </div>
              
              {/* Улюблені */}
              {favoriteMasters.length > 0 && (
                <div className="masters-favorites-section">
                  <div className="masters-favorites-header">
                    <h3>Your Favorite Masters</h3>
                    <p>You have {favoriteMasters.length} favorite master{favoriteMasters.length !== 1 ? 's' : ''} saved</p>
                  </div>
                  <button 
                    className="masters-view-favorites-btn"
                    onClick={() => navigate('/profile?tab=favorites')}
                  >
                    View All Favorites →
                  </button>
                </div>
              )}
            </>
          )}
          
          {/* Бронювання */}
          <div className="masters-booking-cta">
            <h3>Ready to Book Your Appointment?</h3>
            <p>Choose your preferred master and time slot</p>
            <button 
              className="masters-cta-button"
              onClick={() => navigate('/services')}
            >
              Book Appointment Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Masters;