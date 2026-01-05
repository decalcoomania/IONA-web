import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { userData } = useContext(AuthContext);
  
  const isHomePage = location.pathname === '/';
  const isMastersPage = location.pathname === '/masters';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenuToggle = () => setIsMenuOpen(!isMenuOpen);
  
  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };
  
  const scrollToSection = (id) => {
    if (isHomePage) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setIsMenuOpen(false);
      }
    } else {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };
  
  const handleConsultation = () => {
    if (isHomePage) {
      const section = document.getElementById('consultation');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
        setIsMenuOpen(false);
      }
    } else {
      navigate('/');
      setTimeout(() => {
        const section = document.getElementById('consultation');
        if (section) section.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const menuItems = [
    { id: 'home', label: 'Home', onClick: () => handleNavigation('/') },
    { id: 'services', label: 'Services', onClick: () => handleNavigation('/services') },
    { id: 'shop', label: 'IONA Shop', onClick: () => handleNavigation('/iona-shop') },
    { id: 'masters', label: 'Our Masters', onClick: () => handleNavigation('/masters') },
    { id: 'ar', label: 'Virtual Try-On', onClick: () => handleNavigation('/ar-hair') },
    { id: 'about', label: 'About Us', onClick: () => scrollToSection('about') },
    { id: 'consultation', label: 'Consultation', onClick: () => scrollToSection('consultation') },
    { 
      id: 'profile', 
      label: userData ? 'My Profile' : 'Sign In', 
      onClick: () => handleNavigation(userData ? '/profile' : '/login') 
    },
  ];

  return (
    <>
      <header className={`main-header ${isScrolled ? 'scrolled' : ''} ${isHomePage ? 'home' : 'other'} ${isMastersPage ? 'masters-page' : ''}`}>
        <div className="container">
          <div className="header-content">
            {/* Кнопка меню */}
            <button className="menu-button" onClick={handleMenuToggle}>
              <span className="menu-icon">
                <span className="menu-line"></span>
                <span className="menu-line"></span>
                <span className="menu-line"></span>
              </span>
            </button>

            {/* Логотип тільки на головній */}
            {isHomePage && (
              <div className="logo" onClick={() => navigate('/')}>
                <h1 className="logo-title">IONA</h1>
              </div>
            )}

            {/* Права частина - кнопка профілю */}
            <div className="header-right">
              <button 
                className="profile-button" 
                onClick={() => navigate(userData ? '/profile' : '/login')}
              >
                {userData && userData.avatar ? (
                  <img 
                    src={userData.avatar} 
                    alt="Profile" 
                    className="profile-avatar"
                    style={{ 
                      width: '24px', 
                      height: '24px', 
                      borderRadius: '50%',
                      objectFit: 'cover' 
                    }}
                  />
                ) : (
                  <svg className="profile-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="12" cy="7" r="4" strokeWidth="2"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Бічне меню */}
      <div className={`side-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="menu-overlay" onClick={handleMenuToggle}></div>
        <div className="menu-content">
          <div className="menu-header">
            <button className="close-menu" onClick={handleMenuToggle}>
              <span className="close-icon">×</span>
            </button>
          </div>
          <nav className="menu-nav">
            <ul className="menu-list">
              {menuItems.map((item) => (
                <li key={item.id} className="menu-item">
                  <button className="menu-link" onClick={item.onClick}>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <div className="menu-footer">
            <button className="menu-book-btn" onClick={handleConsultation}>
              Get Consultation
              <span className="menu-btn-arrow">→</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;