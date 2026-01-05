import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Header from '../../components/Header/Header';
import './Profile.css';

const Profile = () => {
  const [userData, setUserData] = useState({
    name: 'Anna Smith',
    email: 'anna@example.com',
    phone: '+1 (555) 123-4567',
    avatar: localStorage.getItem('hairSalonUserAvatar') || '',
    joinDate: 'March 2024',
    bio: '',
    theme: 'blue',
    socialLinks: {
      instagram: '',
      facebook: '',
      twitter: ''
    },
    customization: {
      coverColor: '#007377',
      accentColor: '#00cfb4',
      textColor: '#1f2937',
      borderRadius: '16px',
      showStats: true,
      showSocial: false,
      layout: 'default'
    }
  });

  const [bookings, setBookings] = useState([]);
  const [productOrders, setProductOrders] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [favoriteMasters, setFavoriteMasters] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...userData });
  const [activeTab, setActiveTab] = useState('bookings');
  const [customizationModal, setCustomizationModal] = useState(false);

  const layouts = [
    { id: 'default', name: 'Default', icon: '📱' },
    { id: 'compact', name: 'Compact', icon: '📦' },
    { id: 'modern', name: 'Modern', icon: '✨' },
    { id: 'minimal', name: 'Minimal', icon: '🎯' }
  ];

  const { currentUser, logout, getUserData, updateUserData } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('hairSalonUserData')) {
      navigate('/login');
      return;
    }

    loadUserData();
    loadBookings();
    loadProductOrders();
    loadFavoriteMasters();
  }, [navigate]);

  const loadUserData = async () => {
    const savedData = localStorage.getItem('hairSalonUserData');
    if (savedData) {
      const data = JSON.parse(savedData);
      const savedAvatar = localStorage.getItem('hairSalonUserAvatar');
      
      // Об'єднуємо збережені дані з даними за замовчуванням
      const mergedData = { 
        ...userData, // Спочатку дані за замовчуванням
        ...data,     // Потім збережені дані користувача
        avatar: savedAvatar || data.avatar || '',
        theme: data.theme || 'blue',
        customization: data.customization || userData.customization,
        // Переконуємось, що всі обов'язкові поля існують
        name: data.name || userData.name,
        email: data.email || userData.email,
        phone: data.phone || userData.phone,
        bio: data.bio || userData.bio,
        joinDate: data.joinDate || userData.joinDate
      };
      
      setUserData(mergedData);
      setEditForm(mergedData);
      
      applyCustomization(mergedData.customization);
    } else {
      // Якщо немає збережених даних, створюємо новий запис
      const defaultUserData = {
        ...userData,
        joinDate: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long' 
        })
      };
      
      localStorage.setItem('hairSalonUserData', JSON.stringify(defaultUserData));
      setUserData(defaultUserData);
      setEditForm(defaultUserData);
    }
  };

  const loadBookings = () => {
    setLoadingBookings(true);
    setTimeout(() => {
      const savedBookings = JSON.parse(localStorage.getItem('hairSalonBookings')) || [];
      const sortedBookings = savedBookings.sort((a, b) => new Date(b.originalDate || b.bookingDate) - new Date(a.originalDate || a.bookingDate));
      setBookings(sortedBookings);
      setLoadingBookings(false);
    }, 500);
  };

  const loadProductOrders = () => {
    setLoadingOrders(true);
    setTimeout(() => {
      try {
        let savedOrders = JSON.parse(localStorage.getItem('userProductOrders')) || [];
        
        if (savedOrders.length === 0) {
          const shopOrders = JSON.parse(localStorage.getItem('ionaShopOrders')) || [];
          
          const userData = JSON.parse(localStorage.getItem('hairSalonUserData')) || {};
          const userEmail = userData.email;
          
          if (userEmail) {
            savedOrders = shopOrders.filter(order => 
              order.clientEmail === userEmail || order.userEmail === userEmail
            );
          } else {
            const userName = userData.name;
            savedOrders = shopOrders.filter(order => 
              order.clientName === userName || order.userName === userName
            );
          }
          
          if (savedOrders.length > 0) {
            localStorage.setItem('userProductOrders', JSON.stringify(savedOrders));
          }
        }
        
        const sortedOrders = savedOrders.sort((a, b) => {
          const dateA = new Date(a.orderDate || a.createdAt || 0);
          const dateB = new Date(b.orderDate || b.createdAt || 0);
          return dateB - dateA;
        });
        
        setProductOrders(sortedOrders);
      } catch (error) {
        console.error('Error loading product orders:', error);
        setProductOrders([]);
      }
      setLoadingOrders(false);
    }, 500);
  };

  const loadFavoriteMasters = () => {
    const favorites = JSON.parse(localStorage.getItem('favoriteMasters')) || [];
    
    const savedMasters = JSON.parse(localStorage.getItem('hairSalonMasters')) || [];
    const favoriteMastersData = favorites.map(favId => 
      savedMasters.find(m => m.id === favId)
    ).filter(Boolean);
    
    setFavoriteMasters(favoriteMastersData);
  };

  const applyCustomization = (customization) => {
    if (!customization) return;
    
    document.documentElement.style.setProperty('--profile-cover-color', customization.coverColor);
    document.documentElement.style.setProperty('--profile-accent-color', customization.accentColor);
    document.documentElement.style.setProperty('--profile-text-color', customization.textColor);
    document.documentElement.style.setProperty('--profile-border-radius', customization.borderRadius);
  };

  // ОНОВЛЕНА ФУНКЦІЯ: Збереження профілю
  const handleSaveProfile = async () => {
    // Зберігаємо всі дані користувача
    const updatedUserData = {
      ...editForm,
      // Додаємо дату останнього оновлення
      lastUpdated: new Date().toISOString()
    };
    
    // Зберігаємо в localStorage
    localStorage.setItem('hairSalonUserData', JSON.stringify(updatedUserData));
    
    // Якщо є нова аватарка, зберігаємо її окремо
    if (editForm.avatar) {
      localStorage.setItem('hairSalonUserAvatar', editForm.avatar);
    }
    
    // Застосовуємо кастомізацію
    applyCustomization(editForm.customization);
    
    // Оновлюємо стан
    setUserData(updatedUserData);
    setIsEditing(false);
    
    // Показуємо повідомлення про успіх
    alert('✅ Profile saved successfully!');
  };

  // НОВА ФУНКЦІЯ: Збереження налаштувань
  const handleSaveSettings = () => {
    // Зберігаємо зміни з форми редагування
    handleSaveProfile();
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File is too large. Maximum size is 5MB.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const avatarData = reader.result;
        setEditForm({...editForm, avatar: avatarData});
        // Зберігаємо аватарку негайно
        localStorage.setItem('hairSalonUserAvatar', avatarData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCustomizationChange = (key, value) => {
    setEditForm({
      ...editForm,
      customization: {
        ...editForm.customization,
        [key]: value
      }
    });
  };

  // НОВА ФУНКЦІЯ: Збереження кастомізації
  const handleSaveCustomization = () => {
    const updatedUserData = {
      ...userData,
      customization: editForm.customization
    };
    
    // Зберігаємо кастомізацію
    localStorage.setItem('hairSalonUserData', JSON.stringify(updatedUserData));
    
    // Застосовуємо кастомізацію
    applyCustomization(editForm.customization);
    
    // Оновлюємо стан
    setUserData(updatedUserData);
    setCustomizationModal(false);
    
    // Показуємо повідомлення
    alert('✅ Customization saved successfully!');
  };

  const toggleFavoriteMaster = (masterId) => {
    const favorites = JSON.parse(localStorage.getItem('favoriteMasters')) || [];
    const index = favorites.indexOf(masterId);
    
    if (index === -1) {
      favorites.push(masterId);
    } else {
      favorites.splice(index, 1);
    }
    
    localStorage.setItem('favoriteMasters', JSON.stringify(favorites));
    loadFavoriteMasters();
  };

  const handleCancelBooking = (bookingId) => {
    const updatedBookings = bookings.filter(booking => booking.id !== bookingId);
    setBookings(updatedBookings);
    localStorage.setItem('hairSalonBookings', JSON.stringify(updatedBookings));
  };

  const handleCancelProductOrder = (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      const updatedOrders = productOrders.filter(order => order.id !== orderId);
      setProductOrders(updatedOrders);
      localStorage.setItem('userProductOrders', JSON.stringify(updatedOrders));
      
      const shopOrders = JSON.parse(localStorage.getItem('ionaShopOrders')) || [];
      const updatedShopOrders = shopOrders.filter(order => order.id !== orderId);
      localStorage.setItem('ionaShopOrders', JSON.stringify(updatedShopOrders));
    }
  };

  const getOrderStatusDetails = (status) => {
    const statusMap = {
      'pending': { 
        text: 'Pending', 
        description: 'Your order is being processed',
        color: '#f59e0b',
        icon: '⏳'
      },
      'processing': { 
        text: 'Processing', 
        description: 'Preparing your order for shipment',
        color: '#3b82f6',
        icon: '🔧'
      },
      'shipped': { 
        text: 'Shipped', 
        description: 'Your order is on the way',
        color: '#8b5cf6',
        icon: '🚚'
      },
      'delivered': { 
        text: 'Delivered', 
        description: 'Order successfully delivered',
        color: '#10b981',
        icon: '✅'
      },
      'cancelled': { 
        text: 'Cancelled', 
        description: 'Order has been cancelled',
        color: '#ef4444',
        icon: '❌'
      }
    };
    
    return statusMap[status] || statusMap['pending'];
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'bookings':
        return (
          <div className="tab-content">
            <div className="section-header">
              <h2>My Bookings</h2>
              <button className="refresh-btn" onClick={loadBookings} disabled={loadingBookings}>
                {loadingBookings ? 'Loading...' : '↻ Refresh'}
              </button>
            </div>
            
            {loadingBookings ? (
              <div className="loading-state">
                <div className="spinner"></div>
              </div>
            ) : bookings.length > 0 ? (
              <div className="bookings-grid">
                {bookings.map((booking, index) => (
                  <div key={index} className="booking-card">
                    <div className="booking-header">
                      <h3>{booking.serviceName}</h3>
                      <span className={`status ${booking.status}`}>{booking.status}</span>
                    </div>
                    <div className="booking-info">
                      <div className="info-item">
                        <span className="label">📅 Date</span>
                        <span className="value">{booking.date}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">🕒 Time</span>
                        <span className="value">{booking.time}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">💰 Price</span>
                        <span className="value">${booking.price}</span>
                      </div>
                    </div>
                    <div className="booking-actions">
                      <button className="btn secondary" onClick={() => handleCancelBooking(booking.id)}>
                        Cancel
                      </button>
                      <button className="btn primary">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📅</div>
                <h3>No Bookings Yet</h3>
                <p>You haven't booked any services yet.</p>
                <button className="btn primary" onClick={() => navigate('/services')}>
                  Book Now
                </button>
              </div>
            )}
          </div>
        );

      case 'favorites':
        return (
          <div className="tab-content">
            <div className="section-header">
              <h2>Favorite Masters</h2>
              <p className="section-subtitle">{favoriteMasters.length} masters saved</p>
            </div>
            
            {favoriteMasters.length > 0 ? (
              <div className="favorites-grid">
                {favoriteMasters.map((master) => (
                  <div key={master.id} className="master-card">
                    <div className="master-avatar">
                      <img 
                        src={master.image || '/images/default-avatar.jpg'} 
                        alt={master.name}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `<div class="avatar-placeholder-small">${master.name.charAt(0)}</div>`;
                        }}
                      />
                      <button 
                        className="favorite-btn active"
                        onClick={() => toggleFavoriteMaster(master.id)}
                      >
                        ❤️
                      </button>
                    </div>
                    <div className="master-content">
                      <div className="master-header">
                        <h3>{master.name}</h3>
                        <span className="master-specialty">{master.position || master.specialty}</span>
                      </div>
                      <div className="master-stats">
                        <div className="stat">
                          <span className="stat-value">{master.rating || '4.5'}</span>
                          <span className="stat-label">Rating</span>
                        </div>
                        <div className="stat">
                          <span className="stat-value">{master.experience || '5 years'}</span>
                          <span className="stat-label">Experience</span>
                        </div>
                        <div className="stat">
                          <span className="stat-value">{master.likes || 0}</span>
                          <span className="stat-label">Likes</span>
                        </div>
                      </div>
                      <div className="master-actions">
                        <button className="btn primary" onClick={() => navigate('/services')}>
                          Book Now
                        </button>
                        <button className="btn secondary">
                          View Profile
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">❤️</div>
                <h3>No Favorite Masters</h3>
                <p>Like masters to see them here</p>
                <button className="btn primary" onClick={() => navigate('/masters')}>
                  Browse Masters
                </button>
              </div>
            )}
          </div>
        );

      case 'settings':
        return (
          <div className="tab-content">
            <div className="section-header">
              <h2>Profile Settings</h2>
              <div className="edit-actions">
                <button 
                  className="btn primary" 
                  onClick={() => setCustomizationModal(true)}
                >
                  Customize Profile
                </button>
                <button 
                  className="btn primary" 
                  onClick={handleSaveSettings}
                >
                  Save Changes
                </button>
              </div>
            </div>
            
            <div className="settings-form">
              <div className="avatar-section">
                <div className="avatar-preview">
                  {editForm.avatar ? (
                    <img src={editForm.avatar} alt="Avatar" />
                  ) : (
                    <div className="avatar-placeholder" style={{ backgroundColor: '#00525C' }}>
                      {editForm.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="avatar-upload">
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="file-input"
                  />
                  <label htmlFor="avatar-upload" className="btn secondary">
                    {editForm.avatar ? 'Change Photo' : 'Upload Photo'}
                  </label>
                  {editForm.avatar && (
                    <button 
                      className="btn delete-btn small"
                      onClick={() => {
                        setEditForm({...editForm, avatar: ''});
                        localStorage.removeItem('hairSalonUserAvatar');
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
              
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    placeholder="Enter your email"
                  />
                </div>
                
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Bio / About Me</label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                  placeholder="Tell us about yourself..."
                  rows="3"
                />
              </div>
              
              <div className="account-security-section">
                <h3 className="security-title">Account Security</h3>
                <div className="security-actions-grid">
                  <div className="security-action-card">
                    <div className="security-icon">🔒</div>
                    <div className="security-content">
                      <h4>Change Password</h4>
                      <p>Update your password regularly for better security</p>
                    </div>
                    <button 
                      className="btn secondary security-btn"
                      onClick={() => alert('Change password functionality would go here')}
                    >
                      Change
                    </button>
                  </div>
                  
                  <div className="security-action-card">
                    <div className="security-icon">🚫</div>
                    <div className="security-content">
                      <h4>Delete Account</h4>
                      <p>Permanently remove your account and all data</p>
                    </div>
                    <button 
                      className="btn delete security-btn"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                          localStorage.clear();
                          window.location.href = '/';
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="logout-section">
                <button className="btn logout" onClick={() => {
                  logout();
                  navigate('/');
                }}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        );

      case 'product-orders':
        return (
          <div className="tab-content">
            <div className="section-header">
              <h2>My Product Orders</h2>
              <button className="refresh-btn" onClick={loadProductOrders} disabled={loadingOrders}>
                {loadingOrders ? 'Loading...' : '↻ Refresh'}
              </button>
            </div>
            
            {loadingOrders ? (
              <div className="loading-state">
                <div className="spinner"></div>
              </div>
            ) : productOrders.length > 0 ? (
              <div className="product-orders-grid">
                {productOrders.map((order) => {
                  const statusDetails = getOrderStatusDetails(order.status || 'pending');
                  
                  return (
                    <div key={order.id} className="product-order-card">
                      <div className="order-header">
                        <div className="order-info">
                          <h3>Order #{order.id}</h3>
                          <div className="order-status-display" style={{ backgroundColor: `${statusDetails.color}15`, borderColor: statusDetails.color }}>
                            <span className="status-icon">{statusDetails.icon}</span>
                            <div className="status-text">
                              <strong>{statusDetails.text}</strong>
                              <small>{statusDetails.description}</small>
                            </div>
                          </div>
                        </div>
                        <div className="order-date">
                          {order.createdAt || (order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A')}
                        </div>
                      </div>
                      
                      <div className="order-content">
                        {order.type === 'single' || order.productName ? (
                          <div className="single-product-order">
                            {order.productImage && (
                              <div className="single-product-image">
                                <img 
                                  src={order.productImage} 
                                  alt={order.productName}
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.innerHTML = `<div class="image-placeholder-small">${order.productName?.charAt(0) || 'P'}</div>`;
                                  }}
                                />
                              </div>
                            )}
                            <div className="single-product-info">
                              <h4 className="single-product-name">{order.productName || 'Product'}</h4>
                              <div className="single-product-meta">
                                <span className="meta-item">
                                  <strong>Brand:</strong> {order.productBrand || 'N/A'}
                                </span>
                                <span className="meta-item">
                                  <strong>Category:</strong> {order.productCategory || 'N/A'}
                                </span>
                                <span className="meta-item">
                                  <strong>Quantity:</strong> 1
                                </span>
                              </div>
                              <div className="item-price">
                                <span className="price-per-item">${order.productPrice || 0} each</span>
                                <span className="total">Total: ${order.total || order.productPrice || 0}</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="order-items-container">
                            <h4>Items ({order.items?.length || order.itemsCount || 0})</h4>
                            {order.items?.map((item, index) => (
                              <div key={index} className="order-item-card">
                                <div className="item-image-container">
                                  {item.image ? (
                                    <img 
                                      src={item.image} 
                                      alt={item.name}
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.parentElement.innerHTML = `<div class="image-placeholder-small">${item.name?.charAt(0) || 'P'}</div>`;
                                      }}
                                    />
                                  ) : (
                                    <div className="image-placeholder-small">
                                      {item.name?.charAt(0) || 'P'}
                                    </div>
                                  )}
                                </div>
                                <div className="item-info-container">
                                  <div className="item-header">
                                    <h4 className="item-name">{item.name}</h4>
                                    <span className="item-total-price">${(item.price * item.quantity).toFixed(2)}</span>
                                  </div>
                                  <div className="item-details">
                                    <span className="item-brand">{item.brand}</span>
                                    <span className="item-category">{item.category}</span>
                                  </div>
                                  <div className="item-quantity-price">
                                    <span className="quantity-badge">Qty: {item.quantity}</span>
                                    <span className="price-per-item">${item.price} each</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div className="order-summary">
                          <div className="summary-row">
                            <span className="summary-label">Subtotal:</span>
                            <span className="summary-value">${order.subtotal || order.productPrice || order.total || 0}</span>
                          </div>
                          <div className="summary-row">
                            <span className="summary-label">Shipping:</span>
                            <span className="summary-value">
                              {order.shippingCost === 0 ? 'Free' : `$${order.shippingCost}`}
                            </span>
                          </div>
                          <div className="summary-row total-row">
                            <span className="summary-label">Total:</span>
                            <span className="summary-value">${order.total || 0}</span>
                          </div>
                        </div>
                        
                        <div className="order-shipping">
                          <div className="shipping-info">
                            <p><strong>Shipping Address:</strong> {order.shippingAddress || 'Not specified'}</p>
                            <p><strong>Method:</strong> {order.shippingMethod || 'Standard'}</p>
                            <p><strong>Payment:</strong> {order.paymentMethod || 'Card'}</p>
                            <p><strong>Customer:</strong> {order.clientName || order.userName || 'Guest'}</p>
                            <p><strong>Contact:</strong> {order.clientPhone || order.userPhone || 'N/A'}</p>
                          </div>
                          {order.orderNotes && (
                            <div className="order-notes">
                              <p><strong>Notes:</strong> {order.orderNotes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="order-footer">
                        <div className="order-total-display">
                          <span className="total-label">Total Amount:</span>
                          <span className="total-amount">${order.total || 0}</span>
                        </div>
                        <div className="order-actions">
                          {order.status === 'pending' && (
                            <button 
                              className="btn secondary cancel-order-btn" 
                              onClick={() => handleCancelProductOrder(order.id)}
                            >
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🛒</div>
                <h3>No Product Orders Yet</h3>
                <p>You haven't ordered any products from our shop yet.</p>
                <button className="btn primary" onClick={() => window.location.href = '/iona-shop'}>
                  Browse Products
                </button>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const CustomizationModal = () => {
    if (!customizationModal) return null;

    return (
      <div className="modal-overlay" onClick={() => setCustomizationModal(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Customize Profile Design</h3>
            <button className="modal-close" onClick={() => setCustomizationModal(false)}>
              ×
            </button>
          </div>
          
          <div className="modal-body">
            <div className="customization-section">
              <h4>Color Scheme</h4>
              <div className="color-pickers">
                <div className="color-picker">
                  <label>Cover Color</label>
                  <input
                    type="color"
                    value={editForm.customization.coverColor}
                    onChange={(e) => handleCustomizationChange('coverColor', e.target.value)}
                  />
                  <span>{editForm.customization.coverColor}</span>
                </div>
                <div className="color-picker">
                  <label>Accent Color</label>
                  <input
                    type="color"
                    value={editForm.customization.accentColor}
                    onChange={(e) => handleCustomizationChange('accentColor', e.target.value)}
                  />
                  <span>{editForm.customization.accentColor}</span>
                </div>
                <div className="color-picker">
                  <label>Text Color</label>
                  <input
                    type="color"
                    value={editForm.customization.textColor}
                    onChange={(e) => handleCustomizationChange('textColor', e.target.value)}
                  />
                  <span>{editForm.customization.textColor}</span>
                </div>
              </div>
            </div>
            
            <div className="customization-section">
              <h4>Layout Settings</h4>
              <div className="layout-options">
                {layouts.map(layout => (
                  <button
                    key={layout.id}
                    className={`layout-option ${editForm.customization.layout === layout.id ? 'active' : ''}`}
                    onClick={() => handleCustomizationChange('layout', layout.id)}
                  >
                    <span className="layout-icon">{layout.icon}</span>
                    <span className="layout-name">{layout.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="customization-section">
              <h4>Border Radius</h4>
              <div className="slider-container">
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={parseInt(editForm.customization.borderRadius) || 16}
                  onChange={(e) => handleCustomizationChange('borderRadius', `${e.target.value}px`)}
                />
                <span>{editForm.customization.borderRadius}</span>
              </div>
            </div>
            
            <div className="customization-section">
              <h4>Display Options</h4>
              <div className="toggle-options">
                <label className="toggle-option">
                  <input
                    type="checkbox"
                    checked={editForm.customization.showStats}
                    onChange={(e) => handleCustomizationChange('showStats', e.target.checked)}
                  />
                  <span>Show Statistics</span>
                </label>
              </div>
            </div>
            
            <div className="modal-actions">
              <button className="btn primary" onClick={handleSaveCustomization}>
                Save Customization
              </button>
              <button className="btn secondary" onClick={() => setCustomizationModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="profile-page">
      <Header />
      
      <div className="profile-container">
        <div className="profile-sidebar">
          <div className="user-card" style={{ 
            background: `linear-gradient(135deg, ${userData.customization?.coverColor || '#007377'}, ${userData.customization?.accentColor || '#00dbd0'})`,
            borderRadius: userData.customization?.borderRadius || '24px'
          }}>
            <div className="user-avatar">
              {userData.avatar ? (
                <img src={userData.avatar} alt={userData.name} />
              ) : (
                <div className="avatar-placeholder">
                  {userData.name.charAt(0)}
                </div>
              )}
            </div>
            <h2 className="user-name">
              {userData.name}
            </h2>
            <p className="user-email">{userData.email}</p>
            <p className="join-date">Joined {userData.joinDate}</p>
            
            {userData.customization?.showStats && (
              <div className="user-stats">
                <div className="stat">
                  <span className="stat-value">{bookings.length}</span>
                  <span className="stat-label">Services</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{favoriteMasters.length}</span>
                  <span className="stat-label">Favorites</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{productOrders.length}</span>
                  <span className="stat-label">Product Orders</span>
                </div>
              </div>
            )}
          </div>
          
          <nav className="profile-nav">
            <button 
              className={`nav-btn ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => setActiveTab('bookings')}
            >
              <span className="nav-icon">📅</span>
              <span className="nav-text">Services</span>
              <span className="nav-badge">{bookings.length}</span>
            </button>
            
            <button 
              className={`nav-btn ${activeTab === 'product-orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('product-orders')}
            >
              <span className="nav-icon">🛒</span>
              <span className="nav-text">Product Orders</span>
              <span className="nav-badge">{productOrders.length}</span>
            </button>
            
            <button 
              className={`nav-btn ${activeTab === 'favorites' ? 'active' : ''}`}
              onClick={() => setActiveTab('favorites')}
            >
              <span className="nav-icon">❤️</span>
              <span className="nav-text">Favorites</span>
              <span className="nav-badge">{favoriteMasters.length}</span>
            </button>
            
            <button 
              className={`nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <span className="nav-icon">⚙️</span>
              <span className="nav-text">Settings</span>
            </button>
          </nav>
        </div>
        
        <div className="profile-main">
          <div className="profile-header">
            <h1>My Profile</h1>
          </div>
          
          {renderTabContent()}
        </div>
      </div>
      
      <CustomizationModal />
    </div>
  );
};

export default Profile;