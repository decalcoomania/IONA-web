// Gallery.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import './Gallery.css';

const Gallery = () => {
  const { masterId } = useParams();
  const navigate = useNavigate();
  const [master, setMaster] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);

  // Дані майстрів
  const mastersData = {
    1: {
      name: 'Emma Johnson',
      position: 'Senior Stylist',
      specialty: 'Color Correction, Balayage',
      gallery: [
        { id: 1, title: 'Blonde Balayage Transformation', category: 'Coloring' },
        { id: 2, title: 'Brunette to Blonde', category: 'Color Correction' },
        { id: 3, title: 'Summer Highlights', category: 'Balayage' },
        { id: 4, title: 'Ombre Makeover', category: 'Coloring' },
        { id: 5, title: 'Natural Balayage', category: 'Balayage' },
        { id: 6, title: 'Vibrant Color Fusion', category: 'Fantasy Colors' },
      ]
    },
    2: {
      name: 'Michael Chen',
      position: 'Master Barber',
      specialty: 'Men\'s Grooming, Fades',
      gallery: [
        { id: 1, title: 'Classic Fade Cut', category: 'Barber' },
        { id: 2, title: 'Modern Pompadour', category: 'Styling' },
        { id: 3, title: 'Beard Grooming', category: 'Grooming' },
        { id: 4, title: 'Textured Crop', category: 'Haircut' },
        { id: 5, title: 'Undercut Style', category: 'Modern Cut' },
        { id: 6, title: 'Professional Trim', category: 'Maintenance' },
      ]
    },
    3: {
      name: 'Sophia Rodriguez',
      position: 'Style Director',
      specialty: 'Wedding Styling, Extensions',
      gallery: [
        { id: 1, title: 'Elegant Wedding Updo', category: 'Bridal' },
        { id: 2, title: 'Natural Hair Extensions', category: 'Extensions' },
        { id: 3, title: 'Prom Hairstyle', category: 'Special Event' },
        { id: 4, title: 'Volume Extensions', category: 'Extensions' },
        { id: 5, title: 'Braided Crown', category: 'Bridal' },
        { id: 6, title: 'Hollywood Waves', category: 'Styling' },
      ]
    }
  };

  useEffect(() => {
    // Завантажуємо дані майстра
    if (masterId && mastersData[masterId]) {
      setMaster(mastersData[masterId]);
      setGalleryItems(mastersData[masterId].gallery);
    } else {
      // Якщо майстра не знайдено, повертаємо на сторінку майстрів
      navigate('/masters');
    }
  }, [masterId, navigate]);

  if (!master) {
    return <div>Loading...</div>;
  }

  return (
    <div className="gallery-page">
      <Header />
      
      {/* Заголовок галереї конкретного майстра */}
      <section className="gallery-hero">
        <div className="container">
          <h1 className="gallery-title">{master.name}'s Gallery</h1>
          <p className="gallery-subtitle">
            {master.position} specializing in {master.specialty}
          </p>
        </div>
      </section>

      {/* Фільтри галереї */}
      <section className="gallery-filters">
        <div className="container">
          <div className="filter-buttons">
            <button className="filter-btn active">All</button>
            {[...new Set(galleryItems.map(item => item.category))].map(category => (
              <button key={category} className="filter-btn">{category}</button>
            ))}
          </div>
        </div>
      </section>

      {/* Галерея зображень */}
      <section className="gallery-grid-section">
        <div className="container">
          <div className="gallery-grid">
            {galleryItems.map((item) => (
              <div key={item.id} className="gallery-item">
                <div className="gallery-image">
                  <div className="image-placeholder">
                    {item.title}
                  </div>
                </div>
                <div className="gallery-info">
                  <h3>{item.title}</h3>
                  <span className="category">{item.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Кнопка повернення */}
      <section className="gallery-back">
        <div className="container">
          <button 
            className="back-btn"
            onClick={() => navigate('/masters')}
          >
            ← Back to All Masters
          </button>
        </div>
      </section>
    </div>
  );
};

export default Gallery;