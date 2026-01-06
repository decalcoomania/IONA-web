import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import './Services.css';

const Services = () => {
  // Початкові дані послуг з картинками
  const initialServices = [
    { 
      name: 'Haircut & Styling', 
      price: 75, 
      duration: 45, 
      category: 'Haircuts', 
      description: 'Professional haircut with styling',
      image: '/images/haircut.jpg'
    },
    { 
      name: 'Balayage & Ombre', 
      price: 250, 
      duration: 150, 
      category: 'Coloring', 
      description: 'Hand-painted highlighting technique',
      image: '/images/Balayage & Ombre.jpg'
    },
    { 
      name: 'Hair Coloring', 
      price: 150, 
      duration: 90, 
      category: 'Coloring', 
      description: 'Full head color treatment',
      image: '/images/Hair Coloring.jpg'
    },
    { 
      name: 'Keratin Treatment', 
      price: 300, 
      duration: 120, 
      category: 'Treatments', 
      description: 'Smoothing and straightening treatment',
      image: '/images/Keratin Treatment.jpg'
    },
    { 
      name: 'Hair Extensions', 
      price: 500, 
      duration: 240, 
      category: 'Extensions', 
      description: 'Professional hair extensions',
      image: '/images/Hair Extensions.png'
    },
    { 
      name: 'Wedding Styling', 
      price: 200, 
      duration: 90, 
      category: 'Special', 
      description: 'Special occasion bridal styling',
      image: '/images/Wedding Styling.jpg'
    },
    { 
      name: "Men's Haircut", 
      price: 60, 
      duration: 30, 
      category: 'Haircuts', 
      description: 'Professional men\'s haircut',
      image: '/images/Men\'s Haircut.jpg'
    },
    { 
      name: 'Hair Treatment', 
      price: 100, 
      duration: 60, 
      category: 'Treatments', 
      description: 'Deep conditioning treatment',
      image: '/images/Hair Treatment.jpg'
    },
    { 
      name: 'Blowout', 
      price: 60, 
      duration: 45, 
      category: 'Styling', 
      description: 'Professional blow dry styling',
      image: '/images/Blowout.jpg'
    },
    { 
      name: 'Color Correction', 
      price: 300, 
      duration: 180, 
      category: 'Coloring', 
      description: 'Corrective coloring service',
      image: '/images/Color Correction.jpg'
    },
    { 
      name: 'Perm', 
      price: 200, 
      duration: 150, 
      category: 'Treatments', 
      description: 'Professional perming service',
      image: '/images/Perm.jpg'
    },
    { 
      name: 'Updo Styling', 
      price: 120, 
      duration: 60, 
      category: 'Styling', 
      description: 'Elegant updo hairstyle',
      image: '/images/Updo Styling.png'
    },
  ];

  // Цінові діапазони
  const priceRanges = [
    { label: '$50 - $100', min: 50, max: 100 },
    { label: '$100 - $200', min: 100, max: 200 },
    { label: '$200 - $300', min: 200, max: 300 },
    { label: '$300 - $500', min: 300, max: 500 },
    { label: '$500+', min: 500, max: Infinity }
  ];

  // Тривалість послуг
  const durations = [
    { label: 'Quick (under 30 min)', max: 30 },
    { label: 'Standard (30-60 min)', min: 30, max: 60 },
    { label: 'Extended (60-90 min)', min: 60, max: 90 },
    { label: 'Comprehensive (90-120 min)', min: 90, max: 120 },
    { label: 'Full Service (120+ min)', min: 120, max: Infinity }
  ];

  // Категорії
  const categories = [
    'Haircuts',
    'Coloring',
    'Treatments',
    'Extensions',
    'Special',
    'Styling'
  ];

const specialOffers = [
  { 
    name: 'Summer Blow Package', 
    originalPrice: 280, 
    price: 199, 
    description: 'Haircut + Color + Treatment',
    shortDescription: 'Get 3 premium services at special price',
    tag: 'Most Popular',
    discount: '29% OFF',
    image: '/images/promotions/summer-blow.jpg' // Додайте вашу фотку тут
  },
  { 
    name: 'New Client Special', 
    originalPrice: 120, 
    price: 85, 
    description: 'First visit discount 30%',
    shortDescription: 'Special offer for first-time customers',
    tag: 'Limited',
    discount: '30% OFF',
    image: '/images/promotions/new-client.jpg' // Додайте вашу фотку тут
  },
  { 
    name: 'Keratin Treatment', 
    originalPrice: 380, 
    price: 299, 
    description: 'Smoothing + Blowout',
    shortDescription: 'Professional smoothing with styling',
    tag: 'Sale',
    discount: '21% OFF',
    image: '/images/promotions/keratin-sale.jpg' // Додайте вашу фотку тут
  },
];

  // State для фільтрів
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [selectedDurations, setSelectedDurations] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filteredServices, setFilteredServices] = useState(initialServices);

  // State для модального вікна бронювання
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');

  // State для бронювань
  const [bookings, setBookings] = useState([]);

  // Додайте цей state разом з іншими
// Додайте ці стати разом з іншими
const [selectedMasterId, setSelectedMasterId] = useState(null);
const [availableMasters, setAvailableMasters] = useState([]);
const [showMastersDropdown, setShowMastersDropdown] = useState(false);

// Отримання майстрів з localStorage
useEffect(() => {
  const savedMasters = JSON.parse(localStorage.getItem('hairSalonMasters')) || [];
  setAvailableMasters(savedMasters);
}, []);
  // Завантаження бронювань при монтуванні
  useEffect(() => {
    const savedBookings = JSON.parse(localStorage.getItem('hairSalonBookings')) || [];
    setBookings(savedBookings);
  }, []);

  // Часи для бронювання
  const availableTimes = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
    '15:00', '16:00', '17:00', '18:00', '19:00'
  ];

  // Функції для обробки фільтрів
  const handlePriceRangeChange = (rangeLabel) => {
    setSelectedPriceRanges(prev => 
      prev.includes(rangeLabel) 
        ? prev.filter(r => r !== rangeLabel)
        : [...prev, rangeLabel]
    );
  };

  const handleDurationChange = (durationLabel) => {
    setSelectedDurations(prev => 
      prev.includes(durationLabel) 
        ? prev.filter(d => d !== durationLabel)
        : [...prev, durationLabel]
    );
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Фільтрація послуг
  useEffect(() => {
    let result = initialServices;

    // Фільтр за ціною
    if (selectedPriceRanges.length > 0) {
      const priceFilters = selectedPriceRanges.map(rangeLabel => {
        const range = priceRanges.find(r => r.label === rangeLabel);
        return range;
      });

      result = result.filter(service => {
        return priceFilters.some(filter => 
          service.price >= filter.min && service.price <= filter.max
        );
      });
    }

    // Фільтр за тривалістю
    if (selectedDurations.length > 0) {
      const durationFilters = selectedDurations.map(durationLabel => {
        const duration = durations.find(d => d.label === durationLabel);
        return duration;
      });

      result = result.filter(service => {
        return durationFilters.some(filter => {
          const meetsMin = filter.min ? service.duration >= filter.min : true;
          const meetsMax = filter.max ? service.duration <= filter.max : true;
          return meetsMin && meetsMax;
        });
      });
    }

    // Фільтр за категорією
    if (selectedCategories.length > 0) {
      result = result.filter(service => 
        selectedCategories.includes(service.category)
      );
    }

    setFilteredServices(result);
  }, [selectedPriceRanges, selectedDurations, selectedCategories]);

  // Функція для збереження бронювання
const saveBooking = (bookingData) => {
  const selectedMaster = availableMasters.find(m => m.id === selectedMasterId);
  
  const newBooking = {
    id: Date.now(),
    ...bookingData,
    masterId: selectedMasterId,
    masterName: selectedMaster ? selectedMaster.name : 'Any Available',
    status: 'confirmed',
    bookingDate: new Date().toISOString(),
    createdAt: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  };
  
  const updatedBookings = [...bookings, newBooking];
  setBookings(updatedBookings);
  localStorage.setItem('hairSalonBookings', JSON.stringify(updatedBookings));
  
  // Успішне повідомлення
  alert(`✅ Booking confirmed!\n\nService: ${bookingData.serviceName}\nMaster: ${selectedMaster ? selectedMaster.name : 'Any Available'}\nDate: ${bookingData.date}\nTime: ${bookingData.time}\n\nYou can view your booking in the Profile page.`);
  
  // Перенаправлення на профіль
  setTimeout(() => {
    window.location.href = '/profile';
  }, 2000);
};

  // Функція для відкриття модального вікна бронювання
const handleBookNow = (service) => {
  setSelectedService(service);
  setSelectedMasterId(null);
  setIsBookingModalOpen(true);
};

  // Функція для закриття модального вікна
  const handleCloseModal = () => {
    setIsBookingModalOpen(false);
    setSelectedService(null);
    setSelectedDate('');
    setSelectedTime('');
    setClientName('');
    setClientPhone('');
    setClientEmail('');
  };

  // Функція для відправлення форми бронювання
  const handleBookingSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedService || !selectedDate || !selectedTime || !clientName || !clientPhone || !clientEmail) {
      alert('Please fill all required fields');
      return;
    }

    const bookingData = {
      serviceName: selectedService.name,
      price: selectedService.price,
      duration: selectedService.duration,
      category: selectedService.category,
      date: new Date(selectedDate).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      time: selectedTime,
      clientName,
      clientPhone,
      clientEmail,
      originalDate: selectedDate // Зберігаємо оригінальну дату для сортування
    };
    
    saveBooking(bookingData);
    handleCloseModal();
  };

  // Скидання всіх фільтрів
  const resetFilters = () => {
    setSelectedPriceRanges([]);
    setSelectedDurations([]);
    setSelectedCategories([]);
  };

  // Генерація дат на наступні 14 днів
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };
  // Додайте цей код у ваш компонент React в кінець, але перед export default Services;

useEffect(() => {
  // Акордеон для фільтрів
  const filterSections = document.querySelectorAll('.filters-section-title');
  
  filterSections.forEach(section => {
    section.addEventListener('click', () => {
      section.classList.toggle('active');
    });
  });
  
  // Клік на заголовок Filters розкриває/закриває всі секції
  const filtersTitle = document.querySelector('.filterss-title');
  if (filtersTitle) {
    filtersTitle.addEventListener('click', () => {
      const isActive = filtersTitle.classList.toggle('active');
      const allSections = document.querySelectorAll('.filters-section');
      allSections.forEach(section => {
        if (isActive) {
          section.classList.add('active');
        } else {
          section.classList.remove('active');
        }
      });
    });
  }
  
  return () => {
    // Cleanup event listeners if needed
    filterSections.forEach(section => {
      section.removeEventListener('click', () => {});
    });
    if (filtersTitle) {
      filtersTitle.removeEventListener('click', () => {});
    }
  };
}, []);
// Додайте цей useEffect після інших useEffect
useEffect(() => {
  const handleClickOutside = (event) => {
    if (showMastersDropdown && !event.target.closest('.dropdown-wrapper')) {
      setShowMastersDropdown(false);
    }
  };

  document.addEventListener('click', handleClickOutside);
  return () => {
    document.removeEventListener('click', handleClickOutside);
  };
}, [showMastersDropdown]);
  return (
    <div className="services-page">
      <Header />
      
      {/* Головний контейнер */}
      <div className="services-container">
        {/* Фільтри зліва */}
        <div className="filters-sidebars">
          <div className="filters-containers">
            <h2 className="filterss-title">Filters</h2>
            
            {/* Цінові діапазони */}
            <div className="filters-section">
              <h3 className="filters-section-title">Price Range</h3>
              <div className="filters-option">
                {priceRanges.map((range, index) => (
                  <div key={index} className="filter-option">
                    <input 
                      type="checkbox" 
                      id={`price-${index}`}
                      className="filters-checkbox"
                      checked={selectedPriceRanges.includes(range.label)}
                      onChange={() => handlePriceRangeChange(range.label)}
                    />
                    <label htmlFor={`price-${index}`} className="filters-label">
                      {range.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Тривалість */}
            <div className="filters-section">
              <h3 className="filters-section-title">Service Duration</h3>
              <div className="filters-option">
                {durations.map((duration, index) => (
                  <div key={index} className="filter-option">
                    <input 
                      type="checkbox" 
                      id={`duration-${index}`}
                      className="filters-checkbox"
                      checked={selectedDurations.includes(duration.label)}
                      onChange={() => handleDurationChange(duration.label)}
                    />
                    <label htmlFor={`duration-${index}`} className="filters-label">
                      {duration.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Категорії */}
            <div className="filters-section">
              <h3 className="filters-section-title">Categories</h3>
              <div className="filters-option">
                {categories.map((category, index) => (
                  <div key={index} className="filter-option">
                    <input 
                      type="checkbox" 
                      id={`category-${index}`}
                      className="filters-checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                    />
                    <label htmlFor={`category-${index}`} className="filters-label">
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Кнопка скидання */}
            {(selectedPriceRanges.length > 0 || selectedDurations.length > 0 || selectedCategories.length > 0) && (
              <button className="reset-btn" onClick={resetFilters}>
                <span className="reset-icon">↻</span>
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Контент з послугами */}
        <div className="services-content">
          <div className="services-card">
            {/* Заголовок */}
            <h1 className="services-titles">Our Services</h1>
            <p className="services-subtitle">
              Discover our premium hair services designed to enhance your natural beauty
            </p>

            {/* Основна частина з двома колонками */}
            <div className="main-content-wrapper">
              {/* Ліва колонка - список послуг */}
              <div className="services-list-section">
                <div className="list-header">
                  <h2 className="lists-title">All Services</h2>
                  <div className="results-count">
                    {filteredServices.length} services found
                  </div>
                </div>
                
                <div className="services-list">
                  {filteredServices.length > 0 ? (
                    filteredServices.map((service, index) => (
                      <div key={index} className="service-item">
                        {/* ШИРША та ДОВША картинка зліва */}
                        <div className="service-image-container">
                          <div className="service-image">
                            {service.image ? (
                              <img 
                                src={service.image} 
                                alt={service.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}
                              />
                            ) : (
                              <div className="image-placeholder">
                                <span className="image-text">{service.name.charAt(0)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Контент справа */}
                        <div className="service-content">
                          <div className="service-header">
                            <div className="service-title-section">
                              <h3 className="service-name">{service.name}</h3>
                              <span className="service-price">${service.price}</span>
                            </div>
                          </div>
                          <p className="service-description">{service.description}</p>
                          <div className="service-info">
                            <span className="service-duration">⏱️ {service.duration} min</span>
                            <span className="service-category">🏷️ {service.category}</span>
                          </div>
                          <button className="book-btn" onClick={() => handleBookNow(service)}>
                            Book Now
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-results">
                      <p>No services match your filters. Try adjusting your criteria.</p>
                    </div>
                  )}
                </div>
              </div>

{/* Права колонка - акційні пропозиції */}
<div className="special-offers-sidebar">
  <div className="offers-sidebar-contents">
    <h2 className="offers-titles">Special Offers</h2>
    <p className="offers-subtitles">Limited time deals</p>
    
    <div className="offers-list">
      {specialOffers.map((offer, index) => (
        <div key={index} className="offer-sidebar-card">
          
          {/* Картинка зліва - ВУЖЧА */}
          <div className="offer-images-container">
            <div className="offer-images">
              {offer.image ? (
                <img 
                  src={offer.image} 
                  alt={offer.name}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover', 
                    borderRadius: '10px' 
                  }}
                />
              ) : (
                <div className="images-placeholder">
                  <span className="images-text">{offer.name.charAt(0)}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Контент справа від картинки */}
          <div className="offer-sidebar-content">
            <div className="offers-sidebar-header">
              <h3 className="offers-sidebar-name">{offer.name}</h3>
              <div className="offer-price-infos">
                <div className="offer-pricess">
                  <span className="original-pricess">${offer.originalPrice}</span>
                  <span className="current-pricess">${offer.price}</span>
                </div>
                <div className="offers-discount">{offer.discount}</div>
              </div>
            </div>
            <p className="offer-sidebar-descriptions">{offer.shortDescription}</p>
            <button 
              className="offers-sidebar-btn"
              onClick={() => {
                const service = {
                  name: offer.name,
                  price: offer.price,
                  duration: 120,
                  category: 'Special Offer',
                  description: offer.description
                };
                handleBookNow(service);
              }}
            >
              Book Now
            </button>
          </div>
        </div>
      ))}
    </div>
    
    <div className="offers-notes">
      <p>⚠️ Offers cannot be combined. Valid until specified date.</p>
    </div>
  </div>
</div>
            </div>
          </div>
        </div>
      </div>

      {isBookingModalOpen && (
  <div className="booking-modal-overlay" onClick={handleCloseModal}>
    <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
      {/* Хедер модального вікна */}
      <div className="modal-headers">
        <div className="modal-header-contents">
          <h2 className="modal-titles">
            <span className="modal-title-icons">📅</span>
            Book Appointment
          </h2>
          <div className="modal-subtitle">
            Complete the form below to book your service
          </div>
        </div>
        <button className="close-modal" onClick={handleCloseModal}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
      
      <div className="modal-body">
        {/* Інформація про послугу */}
        {selectedService && (
          <div className="service-summary">
            <div className="service-summary-header">
              <div className="service-icon">✂️</div>
              <div className="service-summary-info">
                <h3 className="service-summary-title">{selectedService.name}</h3>
                <div className="service-summary-details">
                  <span className="service-price-badge">${selectedService.price}</span>
                  <span className="service-duration-badge">{selectedService.duration} min</span>
                  <span className="service-category-badge">{selectedService.category}</span>
                </div>
              </div>
            </div>
            <p className="service-summary-description">{selectedService.description}</p>
          </div>
        )}

        {/* Форма бронювання */}
        <form className="booking-form" onSubmit={handleBookingSubmit}>
          {/* Вибір майстра - ВИСУВНЕ МЕНЮ */}
          <div className="form-sections">
            <div className="form-section-headers">
              <h3>Choose Your Master</h3>
              <div className="optional-badge">Optional</div>
            </div>
            
            <div className="dropdown-wrapper">
              <div 
                className="dropdown-toggle"
                onClick={() => setShowMastersDropdown(!showMastersDropdown)}
              >
                <div className="dropdown-selected">
                  {selectedMasterId 
                    ? availableMasters.find(m => m.id === selectedMasterId)?.name 
                    : 'Select a master (optional)'}
                </div>
                <div className={`dropdown-arrow ${showMastersDropdown ? 'open' : ''}`}>
                  ▼
                </div>
              </div>
              
              {showMastersDropdown && (
                <div className="dropdown-menu">
                  <div 
                    className={`dropdown-item ${selectedMasterId === null ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedMasterId(null);
                      setShowMastersDropdown(false);
                    }}
                  >
                    <div className="dropdown-item-content">
                      <div className="dropdown-item-icon">🎲</div>
                      <div className="dropdown-item-text">
                        <div className="dropdown-item-title">Any Available Master</div>
                        <div className="dropdown-item-subtitle">We'll assign the best available specialist</div>
                      </div>
                    </div>
                  </div>
                  
                  {availableMasters.map((master) => (
                    <div 
                      key={master.id} 
                      className={`dropdown-item ${selectedMasterId === master.id ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedMasterId(master.id);
                        setShowMastersDropdown(false);
                      }}
                    >
                      <div className="dropdown-item-content">
                        <div className="dropdown-item-avatar">
                          {master.name.charAt(0)}
                        </div>
                        <div className="dropdown-item-text">
                          <div className="dropdown-item-title">{master.name}</div>
                          <div className="dropdown-item-subtitle">
                            <span className="master-position">{master.position}</span>
                            <span className="master-rating">⭐ {master.rating} ({master.reviews} reviews)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {selectedMasterId && (
              <div className="selected-master-info">
                <span className="selected-master-badge">
                  Selected: {availableMasters.find(m => m.id === selectedMasterId)?.name}
                </span>
              </div>
            )}
          </div>

          {/* Персональна інформація */}
          <div className="form-sections">
            <div className="form-section-headers">
              <h3>Personal Information</h3>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  Full Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter your full name"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  Phone Number <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="Enter your phone number"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  Email Address <span className="required">*</span>
                </label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="Enter your email address"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Вибір дати та часу */}
          <div className="form-sections">
            <div className="form-section-header">
              <h3>Select Date & Time</h3>
            </div>
            
            {/* Календар */}
            <div className="form-group">
              <label className="form-label">
                Appointment Date <span className="required">*</span>
              </label>
              <div className="date-picker-wrapper">
                <select 
                  className="form-select"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                >
                  <option value="">Select a date</option>
                  {getAvailableDates().map((date, index) => (
                    <option key={index} value={date}>
                      {new Date(date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </option>
                  ))}
                </select>
                <div className="select-icon">📅</div>
              </div>
            </div>

            {/* Час */}
            <div className="form-group">
              <label className="form-label">
                Preferred Time <span className="required">*</span>
              </label>
              <div className="time-slots">
                {availableTimes.map((time, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                    onClick={() => setSelectedTime(time)}
                  >
                    <span className="time-slot-text">{time}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Додаткові примітки */}
          <div className="form-sections">
            <div className="form-group">
              <label className="form-label">Special Requests (Optional)</label>
              <textarea
                className="form-textarea"
                placeholder="Any special requests or notes for your appointment..."
                rows="3"
              />
            </div>
          </div>

          {/* Інформаційний блок */}
          <div className="booking-info">
            <div className="info-item">
              <div className="info-icon">✅</div>
              <div className="info-content">
                <div className="info-title">Instant Confirmation</div>
                <div className="info-text">Your booking will be confirmed immediately</div>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">📱</div>
              <div className="info-content">
                <div className="info-title">Manage in Profile</div>
                <div className="info-text">View and manage all bookings in your Profile</div>
              </div>
            </div>
          </div>

          {/* Кнопки форми */}
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={handleCloseModal}>
              Cancel
            </button>
            <button type="submits" className="submits-btn">
              <span className="submits-btn-text">Confirm Booking</span>
              <span className="submits-btn-icon">→</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  
)}

    </div>
  );
};

export default Services;