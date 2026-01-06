// Імпортуємо React та useState для state
import React, { useState, useEffect } from 'react';
// Імпортуємо Header компонент
import Header from '../../components/Header/Header';
// Імпортуємо стилі для Home сторінки
import './Home.css';
import './Modal.css';

// Компонент Home сторінки
const HomePage = () => {
  // Функція для скролу до бронювання
  const handleBookNow = () => {
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Функція для відкриття консультації
  const handleConsultation = () => {
    const consultationSection = document.getElementById('consultation');
    if (consultationSection) {
      consultationSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // State для модального вікна
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State для перемикання картинок - ВИПРАВЛЕНО
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Функція для відкриття модального вікна
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Функція для закриття модального вікна
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Функція для перемикання картинок - ВИПРАВЛЕНО
  const toggleImage = () => {
    setCurrentImageIndex(prevIndex => prevIndex === 0 ? 1 : 0);
  };

  // Додаємо цей state на початку компоненту після інших state
  const [isScrolled, setIsScrolled] = useState(false);

  // Додаємо useEffect для кнопки "Назад наверх"
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Рендеримо компонент
  return (
    <div className="home-page">
      {/* Рендеримо Header */}
      <Header />
      
      {/* Герой секція */}
      <section id="home" className="hero-section">
        <div className="container">
          <div className="hero-content">
            {/* Заголовок */}
            <h1 className="hero-title">
              Your Hair.Your <br />Future.
            </h1>
            
            {/* Кнопки */}
            <div className="hero-buttons">
              {/* Кнопка Book Now */}
              <button 
                className="hero-btn primary"
                onClick={handleBookNow}
              >
                Book Now
              </button>
              {/* Кнопка Get Consultation */}
              <button 
                className="hero-btn secondary"
                onClick={handleConsultation}
              >
                Get your consultation
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Секція статистики */}
      <section id="services" className="stats-section">
        <div className="stats-container">
          {/* Додаємо БЛОК */}
          <div className="stats-block">
            <div className="stats-grid">
              {/* Статистика 1 */}
              <div className="stat-card">
                <div className="stat-number">10+</div>
                <div className="stat-label">Years of Experience</div>
              </div>
              
              {/* Статистика 2 */}
              <div className="stat-card">
                <div className="stat-number">2,500+</div>
                <div className="stat-label">Clients</div>
              </div>
              
              {/* Статистика 3 */}
              <div className="stat-card">
                <div className="stat-number">98%</div>
                <div className="stat-label">Positive Feedback</div>
              </div>
            </div>
          </div>
          {/* КІНЕЦЬ БЛОКУ */}
        </div>
      </section>

      {/* Секція About Us */}
      <section id="about" className="about-section">
        <div className="about-container">
          {/* Блок з картинками */}
          <div className="about-images">
            <div className="image-frame">
              {/* ВИПРАВЛЕНО: відображаємо потрібну картинку */}
              {currentImageIndex === 0 ? (
                <img 
                  src="/images/about1.png" 
                  alt="Our salon" 
                  className="about-image active"
                />
              ) : (
                <img 
                  src="/images/about2.png" 
                  alt="Our team" 
                  className="about-image active"
                />
              )}
            </div>
            <div className="corner-image" onClick={toggleImage}>
              <img 
                src={currentImageIndex === 0 ? "/images/about2.png" : "/images/about1.png"} 
                alt="Click to change" 
                style={{width: '100%', height: '100%', objectFit: 'cover'}}
              />
            </div>
          </div>

          {/* Контент About Us */}
          <div className="about-content">
            <h2 className="about-title">About Us</h2>
            <p className="about-text">
              Welcome to IONA Salon, where hair transformation meets expertise. 
              With over 10 years of experience, our dedicated team of stylists 
              combines creativity with technical skill to deliver exceptional 
              results tailored to your unique style.
            </p>
            <p className="about-text">
              We believe that great hair starts with great care. Our salon uses 
              only premium products and the latest techniques to ensure your hair 
              not only looks amazing but stays healthy and vibrant.
            </p>
            <button className="read-more-btn" onClick={openModal}>
              Read More
              <span style={{fontSize: '20px'}}>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* Секція Our Advantages */}
      <section id="advantages" className="advantages-section">
        <div className="advantages-container">
          {/* Ліва частина - текст */}
          <div className="advantages-content">
            <h2 className="advantages-title">Our Advantages</h2>
            <p className="advantages-text">
              We combine years of expertise with cutting-edge techniques 
              to deliver exceptional results. Our commitment to quality 
              and customer satisfaction sets us apart in the beauty industry.
            </p>
          </div>

          {/* Права частина - картки */}
          <div className="advantages-grid">
            {/* Перевага 1 */}
            <div className="advantage-card">
              <div className="advantage-icon">
                <div style={{
                  width: '50px',
                  height: '50px',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  color: 'white'
                }}>
                  ⭐
                </div>
              </div>
              <h3 className="advantage-title">Expert Stylists</h3>
              <p className="advantage-text">Certified professionals with 10+ years of experience in hair styling and care</p>
            </div>

            {/* Перевага 2 */}
            <div className="advantage-card">
              <div className="advantage-icon">
                <div style={{
                  width: '50px',
                  height: '50px',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  color: 'white'
                }}>
                  💎
                </div>
              </div>
              <h3 className="advantage-title">Premium Products</h3>
              <p className="advantage-text">Using only high-quality, professional-grade hair care products</p>
            </div>

            {/* Перевага 3 */}
            <div className="advantage-card">
              <div className="advantage-icon">
                <div style={{
                  width: '50px',
                  height: '50px',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  color: 'white'
                }}>
                  ⏱️
                </div>
              </div>
              <h3 className="advantage-title">Flexible Hours</h3>
              <p className="advantage-text">Open Mon-Sat from 9AM to 8PM to accommodate your busy schedule</p>
            </div>

            {/* Перевага 4 */}
            <div className="advantage-card">
              <div className="advantage-icon">
                <div style={{
                  width: '50px',
                  height: '50px',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  color: 'white'
                }}>
                  🎯
                </div>
              </div>
              <h3 className="advantage-title">Personalized Service</h3>
              <p className="advantage-text">Customized treatments and consultations for each client's unique needs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Секція Get Your Consultation */}
      <section id="consultation" className="consultation-section">
        <div className="consultation-container">
          {/* Ліва частина - текст */}
          <div className="consultation-content">
            <h2 className="consultation-title">Get Your Consultation</h2>
            <p className="consultation-subtitle">
              Ready to transform your look? Schedule a personalized consultation 
              with our expert stylists. We'll discuss your goals and create a 
              custom plan just for you.
            </p>
          </div>

          {/* Права частина - форма */}
          <div className="consultation-form-wrapper">
            <form className="consultation-form">
              {/* Рядок з двома полями */}
              <div className="form-row">
                <input 
                  type="text" 
                  placeholder="First Name" 
                  className="consultation-input"
                  required
                />
                <input 
                  type="text" 
                  placeholder="Last Name" 
                  className="consultation-input"
                  required
                />
              </div>
              
              {/* Рядок з двома полями */}
              <div className="form-row">
                <input 
                  type="tel" 
                  placeholder="Phone" 
                  className="consultation-input"
                  required
                />
                <input 
                  type="email" 
                  placeholder="Email" 
                  className="consultation-input"
                  required
                />
              </div>
              
              {/* Кнопка Learn More */}
              <button type="submit" className="consultation-submit-btn">
                Get your Consultation
              </button>
            </form>
          </div>
        </div>
      </section>

     
{/* Модальне вікно About Us - ОНОВЛЕНЕ */}
<div className={`iona-modal-overlay ${isModalOpen ? 'active' : ''}`} onClick={closeModal}>
  <div className="iona-modal-content" onClick={(e) => e.stopPropagation()}>
    <div className="iona-modal-header">
      <h3 className="iona-modal-title">IONA Salon Excellence</h3>
      <button className="iona-close-modal" onClick={closeModal} aria-label="Close modal">×</button>
    </div>
    
    <div className="iona-modal-body">
      <div className="iona-modal-story">
        <div className="iona-modal-text">
          <p>
            Founded in 2013, <strong>IONA Salon</strong> began as a visionary boutique studio dedicated to 
            redefining hair excellence through innovation, artistry, and personalized care. 
            Our journey started with a simple belief: every client deserves exceptional service 
            tailored to their unique beauty.
          </p>
          
          <p>
            Over the years, we've grown into a premier destination for hair transformation, 
            serving a community of over <strong>2,500 discerning clients</strong> with an impressive 
            <strong> 98% satisfaction rate</strong>. Our commitment to excellence has made us 
            one of Lviv's most trusted salons.
          </p>
          
          <div className="iona-modal-highlight">
            <h4>Our Philosophy</h4>
            <p>
              We believe great hair starts with understanding. Each consultation begins with 
              listening to your needs, examining your hair's health, and creating a customized 
              plan that enhances your natural beauty while ensuring long-term hair health.
            </p>
          </div>
          
          <p>
            Our internationally certified stylists pursue continuous education in both 
            <strong> timeless techniques</strong> and <strong>cutting-edge trends</strong>. 
            From precision cutting to custom coloring, keratin treatments to bridal styling, 
            every service is executed with meticulous attention to detail.
          </p>
          
          <p>
            We use only <strong>premium professional products</strong> that prioritize hair health, 
            ensuring your transformation not only looks stunning today but remains vibrant 
            and healthy for weeks to come.
          </p>
        </div>
      </div>
      
      <div className="iona-modal-sidebar">
        {/* Карта */}
        <div className="iona-map-container">
          <div className="iona-map-wrapper">
            <iframe 
              className="iona-map-frame"
              title="IONA Salon Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2573.319923292155!2d24.028812315709304!3d49.83985687939552!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x473add6e2f266b5d%3A0xc1bfb3c7b1c6c8f1!2z0J_QsNGC0LjQttC90LDRjyDRg9C7LiwgMjQg0J_QsNCy0LjRgtCw0YAsINCb0YzQstC-0LIsINCb0YzQstC-0LLRgdC60LDRjyDQvtCx0LvQsNGB0YLRjCwgNzkwMDA!5e0!3m2!1suk!2sua!4v1648123456789!5m2!1suk!2sua"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            
            <div className="iona-map-marker">
              <div className="iona-map-marker-dot"></div>
            </div>
            
            <div className="iona-map-overlay">
              <div className="iona-map-info">
                <h4>Visit Our Salon</h4>
                <div className="iona-map-address">24 Patona Street, Lviv 79040</div>
                <div className="iona-map-hours">Mon-Sat: 9AM-8PM | Sun: Closed</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Картка контактів */}
        <div className="iona-contact-card">
          <h4>Contact Details</h4>
          <div className="iona-contact-info">
            <div className="iona-contact-item">
              <div className="iona-contact-icon">📞</div>
              <div className="iona-contact-details">
                <div className="iona-contact-label">Phone</div>
                <div className="iona-contact-value">
                  <a href="tel:+380686865427">(068) 686-5427</a>
                </div>
              </div>
            </div>
            
            <div className="iona-contact-item">
              <div className="iona-contact-icon">✉️</div>
              <div className="iona-contact-details">
                <div className="iona-contact-label">Email</div>
                <div className="iona-contact-value">
                  <a href="mailto:IONAhelp@gmail.com">IONAhelp@gmail.com</a>
                </div>
              </div>
            </div>
            
            <div className="iona-contact-item">
              <div className="iona-contact-icon">🕒</div>
              <div className="iona-contact-details">
                <div className="iona-contact-label">Hours</div>
                <div className="iona-contact-value">
                  Monday - Saturday: 9AM - 8PM<br />
                  Sunday: Closed
                </div>
              </div>
            </div>
          </div>
          
          
        </div>
      </div>
    </div>
    
    <div className="iona-modal-footer">
      <div className="iona-modal-cta">
        Ready to transform your look?
      </div>
      <button 
        className="iona-book-appointment-btn"
        onClick={() => {
          closeModal();
          handleConsultation();
        }}
      >
        Book Your Appointment
        <span style={{fontSize: '18px'}}>→</span>
      </button>
    </div>
  </div>
</div>

{/* Футер */}
<footer className="footer">
  <div className="footer-container">
    <div className="footer-top">
      {/* Бренд */}
      <div className="footer-brand">
        <div className="footer-logo">IONA</div>
        <p className="footer-description">
          Transforming hair and lives since 2013. 
          Our expert team is dedicated to providing 
          exceptional hair care services with premium 
          products and personalized attention.
        </p>
        <div className="social-links">
          <a
            href="https://instagram.com/iona"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            aria-label="Instagram"
          >
            📷
          </a>
          <a
            href="https://facebook.com/iona"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            aria-label="Facebook"
          >
            📘
          </a>
          <a
            href="https://twitter.com/iona"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            aria-label="Twitter"
          >
            🐦
          </a>
          <a
            href="https://youtube.com/iona"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            aria-label="YouTube"
          >
            📺
          </a>
        </div>
      </div>

      {/* Посилання */}
      <div className="footer-column">
        <h3>Services</h3>
        <ul className="footer-links">
          <li><a href="#services">Hair Cutting</a></li>
          <li><a href="#services">Coloring</a></li>
          <li><a href="#services">Styling</a></li>
          <li><a href="#services">Treatments</a></li>
          <li><a href="#services">Extensions</a></li>
        </ul>
      </div>

      <div className="footer-column">
        <h3>Company</h3>
        <ul className="footer-links">
          <li><a href="/">Home</a></li>
          <li><a href="/services">Services</a></li>
          <li><a href="/iona-shop">IONA Shop</a></li>
          <li><a href="/masters">Our Masters</a></li>
          <li><a href="/ar-hair">VR Try-on</a></li>
          <li><a href="#about">About Us</a></li>
          <li><a href="#consultation">Consultation</a></li>
          <li><a href="/profile">My Profile</a></li>
        </ul>
      </div>

      {/* Контакти */}
      <div className="footer-column">
        <h3>Contact</h3>
        <div className="footer-contact">
          <p>
            <strong>Phone:</strong>
            <span>(068) 686-5427</span>
          </p>
          <p>
            <strong>Email:</strong>
            <span>IONAhelp@gmail.com</span>
          </p>
          <p>
            <strong>Address:</strong>
            <span>24 Patona Street, Lviv 79040</span>
          </p>
          <p>
            <strong>Hours:</strong>
            <span>Mon-Sat: 9AM-8PM</span>
          </p>
        </div>
      </div>
    </div>

    {/* Нижня частина футера */}
    <div className="footer-bottom">
      <div className="copyright">
        © 2025 IONA Salon. All rights reserved.
      </div>
      <div className="footer-legal">
        <a href="/privacy" className="footer-legal-link">Privacy Policy</a>
        <a href="/terms" className="footer-legal-link">Terms of Service</a>
        <a href="/cookies" className="footer-legal-link">Cookie Policy</a>
      </div>
    </div>
  </div>
</footer>

      {/* Кнопка назад наверх */}
      <button 
        className={`back-to-top ${isScrolled ? 'visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        ↑
      </button>
    </div>
  );
};

// Експортуємо компонент
export default HomePage;