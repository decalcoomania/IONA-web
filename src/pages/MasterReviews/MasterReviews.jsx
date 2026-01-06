import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import './MasterReviews.css';

const MasterReviews = () => {
  const { masterId } = useParams();
  const navigate = useNavigate();
  const [master, setMaster] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [worksGallery, setWorksGallery] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
    photos: []
  });
  const [activeTab, setActiveTab] = useState('reviews');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showWorkModal, setShowWorkModal] = useState(false);
  const [selectedWork, setSelectedWork] = useState(null);

  // Masters data - тільки Анастасія та Юрій
  const mastersData = [
    {
      id: 3,
      name: 'Anastasia Filypiv',
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
    }
  ];

  // Works Gallery для кожного майстра
  const getWorksByMasterId = (id) => {
    const works = {
      3: [ // Анастасія Филипів
        {
          id: 1,
          title: 'Color + Haircut',
          beforeImage: '/images/ba/tanya.jpg',
          afterImage: '/images/ba/tanya2.jpg',
          clientName: 'Tanyushka',
          review: 'I wanted a radical change. Anastasia said: say no more — and turned me purple 💜😈 Perfect color, perfect cut, and now my friends are fighting over my stylist\'s contact.',
          rating: 5,
          service: 'Coloring + Haircut',
          date: '2024-03-10'
        },
        {
          id: 2,
          title: 'Color + Haircut',
          beforeImage: '/images/ba/diana1.jpg',
          afterImage: '/images/ba/diana2.jpg',
          clientName: 'Diana',
          review: 'I wanted a radical change and got it! Anastasiia chose the perfect shade and haircut style. All my friends ask who my master is!',
          rating: 5,
          service: 'Coloring + Haircut',
          date: '2024-02-28'
        },
        {
          id: 3,
          title: 'Damaged Hair Restoration',
          beforeImage: '/images/ba/nastya1.jpg',
          afterImage: '/images/ba/nastya2.jpg',
          clientName: 'Anastasiia',
          review: 'After an unsuccessful coloring in another salon, my hair was in terrible condition. Anastasia saved it! After 3 procedures, my hair became healthy and shiny.',
          rating: 5,
          service: 'Restoration Procedures',
          date: '2024-02-15'
        },
        {
          id: 4,
          title: 'Evening Hairstyle',
          beforeImage: '/images/ba/roksa1.jpg',
          afterImage: '/images/ba/roksa2.png',
          clientName: 'Roksolana',
          review: 'Finally found a master who makes perfect evening hairstyles! Anastasia created an incredible look for my wedding. Everything held up all day!',
          rating: 5,
          service: 'Evening Styling',
          date: '2024-01-20'
        }
      ],
      4: [ // Юрій Пропів
        {
          id: 5,
          title: 'Fantasy Color Transformation',
          beforeImage: '/images/ba/before1.jpg',
          afterImage: '/images/ba/vika2.png',
          clientName: 'Viktoria',
          review: 'Yurii created incredible rainbow hair for me! Perfect color transitions and excellent care. My hair looks amazing and feels healthy.',
          rating: 5,
          service: 'Fantasy Coloring',
          date: '2024-03-12'
        },
        {
          id: 6,
          title: 'Ombre Makeover',
          beforeImage: '/images/ba/kolya1.jpg',
          afterImage: '/images/ba/kolya2.jpg',
          clientName: 'Nikshit',
          review: 'Paid for a f*cking ombre. What I got is a hair crime so severe, I\'m under witness protection in a beanie. This is a whole new level of messed up.',
          rating: 0,
          service: 'Ombre Coloring',
          date: '2024-03-05'
        },
        {
          id: 7,
          title: 'Vibrant Green Transformation',
          beforeImage: '/images/ba/pups1.jpg',
          afterImage: '/images/ba/pups2.png',
          clientName: 'Anastasiia',
          review: 'Went in for a nice green dye job, left with this bullsht. The stylist butchered my hair. It\'s fcking awful. Do not go here.',
          rating: 1,
          service: 'Vibrant Color',
          date: '2024-02-20'
        },
        {
          id: 8,
          title: 'Red Fantasy',
          beforeImage: '/images/ba/roksa2.png',
          afterImage: '/images/ba/morkva1.png',
          clientName: 'Roksolana',
          review: 'Amazing red fantasy colors! Yurii created a unique shade that perfectly suits me. Professional and creative work.',
          rating: 4.9,
          service: 'Fantasy Color',
          date: '2024-02-10'
        }
      ]
    };
    
    return works[id] || [];
  };

  // Default reviews для кожного майстра
  const getDefaultReviewsByMasterId = (id) => {
    const defaultReviews = {
      3: [ // Анастасія Филипів
        {
          id: 1,
          author: 'Maria Kovalenko',
          date: '2024-03-15',
          rating: 5,
          comment: 'Anastasia is a true professional! Did hair extensions - the result exceeded all expectations. The hair looks natural, easy to care for. I recommend!',
          service: 'Hair Extensions',
          photos: []
        },
        {
          id: 2,
          author: 'Olga Petrenko',
          date: '2024-03-10',
          rating: 5,
          comment: 'Went for a haircut and coloring. Anastasia considered all my wishes and advised a shade that perfectly suits my skin. Very satisfied!',
          service: 'Haircut + Coloring',
          photos: []
        },
        {
          id: 3,
          author: 'Anna Sydorenko',
          date: '2024-03-05',
          rating: 5,
          comment: 'Finally found my master! Anastasia is not only a talented stylist but also a great psychologist. Always supports and advises. Thank you for the great work!',
          service: 'Complex Care',
          photos: []
        },
        {
          id: 4,
          author: 'Iryna Melnyk',
          date: '2024-02-28',
          rating: 5,
          comment: 'Did keratin straightening. The result is impressive! Hair is smooth, shiny, easy to comb. Anastasia is very attentive to details.',
          service: 'Keratin Straightening',
          photos: []
        }
      ],
      4: [ // Юрій Пропів
        {
          id: 1001,
          author: 'Kateryna Ivanova',
          date: '2024-03-18',
          rating: 5,
          comment: 'Yurii is a color wizard! My fantasy colors look amazing and last long. Very professional and creative approach.',
          service: 'Fantasy Coloring',
          photos: []
        },
        {
          id: 1002,
          author: 'Alina Petrova',
          date: '2024-03-10',
          rating: 4.7,
          comment: 'Great ombre work! Yurii listened to all my wishes and created exactly what I wanted. Perfect color transition.',
          service: 'Ombre',
          photos: []
        },
        {
          id: 1003,
          author: 'Natalia Sidorova',
          date: '2024-03-01',
          rating: 4.9,
          comment: 'I\'ve been going to Yurii for 3 years now. Always perfect results with fantasy colors. He really understands color theory!',
          service: 'Color Correction',
          photos: []
        },
        {
          id: 1004,
          author: 'Viktoria Melnyk',
          date: '2024-02-25',
          rating: 5,
          comment: 'Yurii transformed my damaged hair with amazing colors while keeping it healthy. True professional!',
          service: 'Coloring + Treatment',
          photos: []
        },
        {
          id: 1005,
          author: 'Oksana Shevchenko',
          date: '2024-02-15',
          rating: 4.8,
          comment: 'Amazing work with bright colors! Yurii knows exactly how to make hair look vibrant without damaging it.',
          service: 'Vibrant Coloring',
          photos: []
        }
      ]
    };
    
    return defaultReviews[id] || [];
  };

  // Open work modal
  const openWorkModal = (work) => {
    console.log('Opening modal for work:', work);
    setSelectedWork(work);
    setShowWorkModal(true);
    
    // Блокуємо прокрутку body
    document.body.style.overflow = 'hidden';
  };

  // Close work modal
  const closeWorkModal = () => {
    setShowWorkModal(false);
    setSelectedWork(null);
    
    // Відновлюємо прокрутку
    document.body.style.overflow = 'auto';
  };

  // Handle click outside modal
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('mr-modal-overlay')) {
      closeWorkModal();
    }
  };

  // Render stars
  const renderStars = (rating) => {
    return (
      <div className="mr-stars">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`mr-star ${i < rating ? 'mr-star-filled' : ''}`}>
            ★
          </span>
        ))}
      </div>
    );
  };

  // Render stars for modal
  const renderModalStars = (rating) => {
    return (
      <div className="mr-modal-stars">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`mr-modal-star ${i < rating ? 'mr-modal-star-filled' : ''}`}>
            ★
          </span>
        ))}
      </div>
    );
  };

  // Get services by master ID
  const getServicesByMasterId = (id) => {
    const services = {
      3: [ // Анастасія
        'Haircuts',
        'Coloring',
        'Extensions',
        'Styling',
        'Restoration',
        'Keratin',
        'Evening Hairstyles',
        'Consultations'
      ],
      4: [ // Юрій
        'Fantasy Colors',
        'Ombre',
        'Balayage',
        'Color Correction',
        'Vibrant Coloring',
        'Pastel Colors',
        'Hair Painting',
        'Color Consultation'
      ]
    };
    
    return services[id] || [];
  };

  useEffect(() => {
    setIsLoading(true);
    setError('');
    
    const foundMaster = mastersData.find(m => m.id === parseInt(masterId));
    
    if (foundMaster) {
      setMaster(foundMaster);
      
      // Load works gallery for this master
      const masterWorks = getWorksByMasterId(parseInt(masterId));
      setWorksGallery(masterWorks);
      
      // Load reviews
      try {
        const savedReviews = localStorage.getItem(`master_${masterId}_reviews`);
        if (savedReviews) {
          const parsedReviews = JSON.parse(savedReviews);
          setReviews(parsedReviews.slice(0, 50));
        } else {
          const defaultReviews = getDefaultReviewsByMasterId(parseInt(masterId));
          setReviews(defaultReviews);
          localStorage.setItem(`master_${masterId}_reviews`, JSON.stringify(defaultReviews));
        }
      } catch (error) {
        const defaultReviews = getDefaultReviewsByMasterId(parseInt(masterId));
        setReviews(defaultReviews);
      }
    }
    
    setTimeout(() => setIsLoading(false), 500);
  }, [masterId]);

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReview.comment.trim()) {
      setError('Please enter a comment');
      return;
    }
    
    const review = {
      id: Date.now(),
      author: 'You',
      date: new Date().toISOString().split('T')[0],
      rating: newReview.rating,
      comment: newReview.comment,
      service: 'Recent Service',
      photos: []
    };
    
    const updatedReviews = [review, ...reviews.slice(0, 99)];
    setReviews(updatedReviews);
    localStorage.setItem(`master_${masterId}_reviews`, JSON.stringify(updatedReviews));
    
    setNewReview({ rating: 5, comment: '', photos: [] });
    alert('Review submitted successfully!');
  };

  const handleDeleteReview = (reviewId) => {
    const updatedReviews = reviews.filter(review => review.id !== reviewId);
    setReviews(updatedReviews);
    localStorage.setItem(`master_${masterId}_reviews`, JSON.stringify(updatedReviews));
  };

  const handleBack = () => navigate('/masters');

  const handleBookAppointment = () => {
    navigate('/services', {
      state: { selectedMaster: master.name, masterId: master.id }
    });
  };

  if (isLoading) {
    return (
      <div className="mr-page">
        <Header />
        <div className="mr-loading">
          <div className="mr-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!master) {
    return (
      <div className="mr-page">
        <Header />
        <div className="mr-error">
          <h2>Master not found</h2>
          <button onClick={handleBack} className="mr-back-btn">
            Back to Masters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mr-page">
      <Header />
      
      {/* Header Section */}
      <section className="mr-hero">
        <div className="mr-container">
          <button onClick={handleBack} className="mr-back-btn">
            ← Back to Masters
          </button>
          
          <div className="mr-master-header">
            <div className="mr-master-avatar">
              {master.image ? (
                <img src={master.image} alt={master.name} />
              ) : (
                <div className="mr-avatar-placeholder">
                  {master.name.charAt(0)}
                </div>
              )}
            </div>
            
            <div className="mr-master-info">
              <h1>{master.name}</h1>
              <p className="mr-master-position">{master.position}</p>
              
              <div className="mr-master-stats">
                <div className="mr-stat">
                  <span className="mr-stat-icon">⭐</span>
                  <span className="mr-stat-value">{master.rating}</span>
                  <span className="mr-stat-label">Rating</span>
                </div>
                <div className="mr-stat">
                  <span className="mr-stat-icon">💬</span>
                  <span className="mr-stat-value">{reviews.length}</span>
                  <span className="mr-stat-label">Reviews</span>
                </div>
                <div className="mr-stat">
                  <span className="mr-stat-icon">📸</span>
                  <span className="mr-stat-value">{worksGallery.length}</span>
                  <span className="mr-stat-label">Works</span>
                </div>
                <div className="mr-stat">
                  <span className="mr-stat-icon">⏳</span>
                  <span className="mr-stat-value">{master.experience}</span>
                  <span className="mr-stat-label">Experience</span>
                </div>
              </div>
              
              <button onClick={handleBookAppointment} className="mr-book-btn">
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="mr-tabs-container">
        <div className="mr-container">
          <div className="mr-tabs">
            <button 
              className={`mr-tab ${activeTab === 'reviews' ? 'mr-tab-active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              <span className="mr-tab-icon">💬</span>
              <span className="mr-tab-text">Reviews ({reviews.length})</span>
            </button>
            <button 
              className={`mr-tab ${activeTab === 'works' ? 'mr-tab-active' : ''}`}
              onClick={() => setActiveTab('works')}
            >
              <span className="mr-tab-icon">📸</span>
              <span className="mr-tab-text">Works ({worksGallery.length})</span>
            </button>
            <button 
              className={`mr-tab ${activeTab === 'info' ? 'mr-tab-active' : ''}`}
              onClick={() => setActiveTab('info')}
            >
              <span className="mr-tab-icon">ℹ️</span>
              <span className="mr-tab-text">About Master</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mr-content">
        <div className="mr-container">
          {activeTab === 'reviews' && (
            <div className="mr-reviews-content">
              <div className="mr-add-review">
                <h2>Add Your Review</h2>
                {error && <div className="mr-error-msg">{error}</div>}
                <form onSubmit={handleAddReview} className="mr-review-form">
                  <div className="mr-form-group">
                    <label>Your Rating</label>
                    <div className="mr-rating">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          className={`mr-rating-btn ${star <= newReview.rating ? 'mr-rating-btn-active' : ''}`}
                          onClick={() => setNewReview({...newReview, rating: star})}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mr-form-group">
                    <label>Your Comment *</label>
                    <textarea
                      value={newReview.comment}
                      onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                      placeholder="Share your experience..."
                      rows="4"
                      required
                      className="mr-textarea"
                      maxLength="1000"
                    />
                    <div className="mr-char-count">
                      {newReview.comment.length}/1000 characters
                    </div>
                  </div>
                  
                  <button type="submit" className="mr-submit-btn">
                    Submit Review
                  </button>
                </form>
              </div>
              
              <div className="mr-reviews-list">
                <h2>All Reviews ({reviews.length})</h2>
                {reviews.length === 0 ? (
                  <div className="mr-no-reviews">
                    <p>No reviews yet. Be the first!</p>
                  </div>
                ) : (
                  reviews.map(review => (
                    <div key={review.id} className="mr-review-card">
                      <div className="mr-review-header">
                        <div className="mr-review-author">
                          <h4>{review.author}</h4>
                          <p className="mr-review-date">{review.date} • {review.service}</p>
                        </div>
                        <div className="mr-review-rating">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      <p className="mr-review-comment">{review.comment}</p>
                      {review.author === 'You' && (
                        <button
                          onClick={() => handleDeleteReview(review.id)}
                          className="mr-delete-btn"
                        >
                          Delete Review
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'works' && (
            <div className="mr-works-content">
              <h2>Before & After Gallery ({worksGallery.length})</h2>
              <p className="mr-works-description">Click on any work to view details</p>
              
              <div className="mr-works-grid">
                {worksGallery.map(work => (
                  <div 
                    key={work.id} 
                    className="mr-work-card"
                    onClick={() => openWorkModal(work)}
                  >
                    <div className="mr-work-images">
                      <div className="mr-work-before">
                        <div className="mr-work-label">BEFORE</div>
                        <div className="mr-work-img">
                          <img src={work.beforeImage} alt="Before" />
                        </div>
                      </div>
                      <div className="mr-work-after">
                        <div className="mr-work-label">AFTER</div>
                        <div className="mr-work-img">
                          <img src={work.afterImage} alt="After" />
                        </div>
                      </div>
                    </div>
                    <div className="mr-work-info">
                      <h3>{work.title}</h3>
                      <p className="mr-work-service">{work.service}</p>
                      {renderStars(work.rating)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'info' && (
            <div className="mr-info-content">
              <h2>About {master.name}</h2>
              
              <div className="mr-info-grid">
                <div className="mr-info-card">
                  <span className="mr-info-icon">🎓</span>
                  <h3>Specialization</h3>
                  <p>{master.specialty}</p>
                </div>
                
                <div className="mr-info-card">
                  <span className="mr-info-icon">⏳</span>
                  <h3>Experience</h3>
                  <p>{master.experience} of professional experience</p>
                </div>
                
                <div className="mr-info-card">
                  <span className="mr-info-icon">✨</span>
                  <h3>About</h3>
                  <p>{master.description}</p>
                </div>
              </div>
              
              <div className="mr-services">
                <h3>Services</h3>
                <div className="mr-services-list">
                  {getServicesByMasterId(parseInt(masterId)).map((service, index) => (
                    <span key={index} className="mr-service-tag">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* МОДАЛЬНЕ ВІКНО */}
      {showWorkModal && selectedWork && (
        <div 
          className="mr-modal-overlay"
          onClick={handleOverlayClick}
        >
          <div className="mr-modal">
            <button className="mr-modal-close" onClick={closeWorkModal}>
              ×
            </button>
            
            <div className="mr-modal-content">
              <div className="mr-modal-header">
                <h2 className="mr-modal-title">{selectedWork.title}</h2>
                <p className="mr-modal-service">{selectedWork.service}</p>
                <div className="mr-modal-client">
                  <span>Client: {selectedWork.clientName}</span>
                </div>
              </div>
              
              <div className="mr-modal-images">
                <div className="mr-modal-image-section mr-modal-before">
                  <div className="mr-modal-image-label">Before</div>
                  <div className="mr-modal-img-container">
                    <img src={selectedWork.beforeImage} alt="Before" />
                  </div>
                </div>
                
                <div className="mr-modal-image-section mr-modal-after">
                  <div className="mr-modal-image-label">After</div>
                  <div className="mr-modal-img-container">
                    <img src={selectedWork.afterImage} alt="After" />
                  </div>
                </div>
              </div>
              
              <div className="mr-modal-review-section">
                <div className="mr-modal-rating-row">
                  <div className="mr-modal-rating">
                    {renderModalStars(selectedWork.rating)}
                    <span className="mr-modal-rating-value">{selectedWork.rating}/5</span>
                  </div>
                  <div className="mr-modal-date">Date: {selectedWork.date}</div>
                </div>
                
                <div className="mr-modal-quote-container">
                  <blockquote className="mr-modal-quote">
                    {selectedWork.review}
                  </blockquote>
                </div>
                
                <div className="mr-modal-author">
                  <div className="mr-modal-avatar">
                    {selectedWork.clientName.charAt(0)}
                  </div>
                  <div className="mr-modal-author-info">
                    <h4>{selectedWork.clientName}</h4>
                    <p>Client</p>
                  </div>
                </div>
              </div>
              
              <div className="mr-modal-actions">
                <button className="mr-modal-book-btn" onClick={handleBookAppointment}>
                  Book a Consultation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterReviews;