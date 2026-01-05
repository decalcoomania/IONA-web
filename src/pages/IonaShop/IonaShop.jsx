import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import './IonaShop.css';
import './CartModal.css'; // Додано імпорт нового CSS файлу

const IonaShop = () => {
  // Дані продуктів з правильними шляхами до public/images
  const initialProducts = [
    { 
      id: 1,
      name: 'L\'Oréal Professionnel Shampoo', 
      price: 22, 
      brand: 'L\'Oréal Professionnel',
      category: 'Shampoo',
      priceRange: 'Under $25',
      availability: 'In Stock',
      description: 'Professional shampoo for color-treated hair',
      image: '/images/products/L\'Oréal Professionnel Shampoo.png',
      quantity: 1
    },
    { 
      id: 2,
      name: 'Kérastase Elixir Ultime', 
      price: 45, 
      brand: 'Kérastase',
      category: 'Hair Oil',
      priceRange: '$25 - $50',
      availability: 'In Stock',
      description: 'Luxury hair oil for ultimate shine',
      image: '/images/products/Kérastase Elixir Ultime.png',
      quantity: 1
    },
    { 
      id: 3,
      name: 'Davines Hair Mask', 
      price: 65, 
      brand: 'Davines',
      category: 'Treatment',
      priceRange: '$50 - $100',
      availability: 'Pre-Order',
      description: 'Nourishing hair mask for damaged hair',
      image: '/images/products/Davines Hair Mask.png',
      quantity: 1
    },
    { 
      id: 4,
      name: 'Olaplex No. 3', 
      price: 28, 
      brand: 'Olaplex',
      category: 'Treatment',
      priceRange: '$25 - $50',
      availability: 'In Stock',
      description: 'Hair perfector repairing treatment',
      image: '/images/products/Olaplex No. 3.png',
      quantity: 1
    },
    { 
      id: 5,
      name: 'Schwarzkopf Color Gel', 
      price: 18, 
      brand: 'Schwarzkopf',
      category: 'Coloring',
      priceRange: 'Under $25',
      availability: 'Salon Pickup Available',
      description: 'Professional hair color gel',
      image: '/images/products/Schwarzkopf Color Gel.png',
      quantity: 1
    },
    { 
      id: 6,
      name: 'Wella Professionals Spray', 
      price: 32, 
      brand: 'Wella Professionals',
      category: 'Styling',
      priceRange: '$25 - $50',
      availability: 'In Stock',
      description: 'Professional hair spray with strong hold',
      image: '/images/products/Wella Professionals Spray.png',
      quantity: 1
    },
    { 
      id: 7,
      name: 'IONA Signature Serum', 
      price: 120, 
      brand: 'IONA Signature',
      category: 'Treatment',
      priceRange: '$100+',
      availability: 'Pre-Order',
      description: 'Premium signature hair serum',
      image: '/images/products/IONA Signature Serum.png',
      quantity: 1
    },
    { 
      id: 8,
      name: 'L\'Oréal Conditioner', 
      price: 25, 
      brand: 'L\'Oréal Professionnel',
      category: 'Conditioner',
      priceRange: '$25 - $50',
      availability: 'In Stock',
      description: 'Moisturizing conditioner for daily use',
      image: '/images/products/L\'Oréal Conditioner.png',
      quantity: 1
    },
    { 
      id: 9,
      name: 'Kérastase Resistance Set', 
      price: 85, 
      brand: 'Kérastase',
      category: 'Set',
      priceRange: '$50 - $100',
      availability: 'In Stock',
      description: 'Complete hair resistance set',
      image: '/images/products/Kérastase Resistance Set.png',
      quantity: 1
    },
    { 
      id: 10,
      name: 'Davines Shampoo', 
      price: 42, 
      brand: 'Davines',
      category: 'Shampoo',
      priceRange: '$25 - $50',
      availability: 'Salon Pickup Available',
      description: 'Natural ingredients shampoo',
      image: '/images/products/Davines Shampoo.png',
      quantity: 1
    },
    { 
      id: 11,
      name: 'Olaplex Complete Set', 
      price: 195, 
      brand: 'Olaplex',
      category: 'Set',
      priceRange: '$100+',
      availability: 'Pre-Order',
      description: 'Full Olaplex treatment set',
      image: '/images/products/Olaplex Complete Set.png',
      quantity: 1
    },
    { 
      id: 12,
      name: 'Wella Color Charm', 
      price: 15, 
      brand: 'Wella Professionals',
      category: 'Coloring',
      priceRange: 'Under $25',
      availability: 'In Stock',
      description: 'Vibrant hair color tones',
      image: '/images/products/Wella Color Charm.png',
      quantity: 1
    }
  ];

  // Цінові діапазони
  const priceRanges = [
    { label: 'Under $25', min: 0, max: 25 },
    { label: '$25 - $50', min: 25, max: 50 },
    { label: '$50 - $100', min: 50, max: 100 },
    { label: '$100+', min: 100, max: Infinity }
  ];

  // Бренди
  const brands = [
    'L\'Oréal Professionnel',
    'Kérastase',
    'Davines',
    'Olaplex',
    'Schwarzkopf',
    'Wella Professionals',
    'IONA Signature'
  ];

  // Наявність
  const availabilityOptions = [
    'In Stock',
    'Pre-Order',
    'Salon Pickup Available'
  ];

  // Категорії продуктів
  const categories = [
    'Shampoo',
    'Conditioner',
    'Treatment',
    'Hair Oil',
    'Styling',
    'Coloring',
    'Set'
  ];

  // Спеціальні пропозиції
  const specialOffers = [
    { 
      name: 'Premium Hair Care Bundle', 
      originalPrice: 200, 
      price: 149, 
      description: 'Complete hair care set + free serum',
      tag: 'Sale',
      products: ['Shampoo', 'Conditioner', 'Treatment'],
      image: '/images/offers/bundle.png'
    },
    { 
      name: 'New Customer Deal', 
      originalPrice: 85, 
      price: 59, 
      description: '25% off on first purchase',
      tag: 'Limited',
      products: ['Any product'],
      image: '/images/offers/new-customer.png'
    },
    { 
      name: 'Luxury Hair Oil Set', 
      originalPrice: 120, 
      price: 89, 
      description: 'Kérastase oil + free travel size',
      tag: 'Sale',
      products: ['Hair Oil', 'Treatment'],
      image: '/images/offers/oil-set.png'
    },
  ];

  // State для фільтрів
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState(initialProducts);
  
  // State для кошика
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  
  // State для модального вікна замовлення
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // State для форми замовлення
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [orderNotes, setOrderNotes] = useState('');

  // State для висувних фільтрів
  const [expandedSections, setExpandedSections] = useState({
    priceRange: true,
    brands: true,
    availability: true,
    categories: true
  });

  // Завантаження кошика з localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('ionaShopCart')) || [];
    setCart(savedCart);
    calculateCartTotal(savedCart);
  }, []);

  // Обробка змін фільтрів
  const handlePriceRangeChange = (rangeLabel) => {
    setSelectedPriceRanges(prev => 
      prev.includes(rangeLabel) 
        ? prev.filter(r => r !== rangeLabel)
        : [...prev, rangeLabel]
    );
  };

  const handleBrandChange = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const handleAvailabilityChange = (availability) => {
    setSelectedAvailability(prev => 
      prev.includes(availability) 
        ? prev.filter(a => a !== availability)
        : [...prev, availability]
    );
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleSectionExpand = (sectionName) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  // Фільтрація продуктів
  useEffect(() => {
    let result = initialProducts;

    // Фільтр за ціною
    if (selectedPriceRanges.length > 0) {
      const priceFilters = selectedPriceRanges.map(rangeLabel => {
        const range = priceRanges.find(r => r.label === rangeLabel);
        return range;
      });

      result = result.filter(product => {
        return priceFilters.some(filter => 
          product.price >= filter.min && product.price <= filter.max
        );
      });
    }

    // Фільтр за брендом
    if (selectedBrands.length > 0) {
      result = result.filter(product => 
        selectedBrands.includes(product.brand)
      );
    }

    // Фільтр за наявністю
    if (selectedAvailability.length > 0) {
      result = result.filter(product => 
        selectedAvailability.includes(product.availability)
      );
    }

    // Фільтр за категорією
    if (selectedCategories.length > 0) {
      result = result.filter(product => 
        selectedCategories.includes(product.category)
      );
    }

    setFilteredProducts(result);
  }, [selectedPriceRanges, selectedBrands, selectedAvailability, selectedCategories]);

  // Функції для кошика
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      const updatedCart = cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCart(updatedCart);
      localStorage.setItem('ionaShopCart', JSON.stringify(updatedCart));
      calculateCartTotal(updatedCart);
    } else {
      const newCart = [...cart, { ...product, quantity: 1 }];
      setCart(newCart);
      localStorage.setItem('ionaShopCart', JSON.stringify(newCart));
      calculateCartTotal(newCart);
    }
    
    // Показуємо сповіщення
    showCartNotification(product.name);
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem('ionaShopCart', JSON.stringify(updatedCart));
    calculateCartTotal(updatedCart);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    const updatedCart = cart.map(item =>
      item.id === productId
        ? { ...item, quantity: newQuantity }
        : item
    );
    setCart(updatedCart);
    localStorage.setItem('ionaShopCart', JSON.stringify(updatedCart));
    calculateCartTotal(updatedCart);
  };

  const calculateCartTotal = (cartItems) => {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    setCartTotal(total);
    setCartItemsCount(itemsCount);
  };

  const clearCart = () => {
    setCart([]);
    setCartTotal(0);
    setCartItemsCount(0);
    localStorage.removeItem('ionaShopCart');
  };

  const showCartNotification = (productName) => {
    // Створюємо сповіщення
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-check">✓</span>
        <div>
          <p class="notification-title">Added to cart!</p>
          <p class="notification-message">${productName}</p>
        </div>
        <button class="notification-view-cart" onclick="document.querySelector('.view-cart-btn').click()">
          View Cart
        </button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Автоматично видаляємо сповіщення через 3 секунди
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s forwards';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  };

  // Функції для замовлення
  const handleOrderNow = (product) => {
    setSelectedProduct(product);
    setIsOrderModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsOrderModalOpen(false);
    setIsCartModalOpen(false);
    setSelectedProduct(null);
    setClientName('');
    setClientPhone('');
    setClientEmail('');
    setShippingAddress('');
    setShippingMethod('standard');
    setPaymentMethod('card');
    setOrderNotes('');
  };

  const saveOrder = (orderData) => {
    const orderId = Date.now();
    const userData = JSON.parse(localStorage.getItem('hairSalonUserData')) || {};
    const currentUserName = userData.name || 'Guest';
    const currentUserEmail = userData.email || 'guest@example.com';
    
    const newOrder = {
      id: orderId,
      ...orderData,
      status: 'pending',
      orderDate: new Date().toISOString(),
      createdAt: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      userId: userData.id || null,
      userName: currentUserName,
      userEmail: currentUserEmail,
      userPhone: userData.phone || '',
      type: orderData.type || (orderData.items ? 'cart' : 'single')
    };
    
    // 1. Зберігаємо в ionaShopOrders
    const savedOrders = JSON.parse(localStorage.getItem('ionaShopOrders')) || [];
    const updatedOrders = [...savedOrders, newOrder];
    localStorage.setItem('ionaShopOrders', JSON.stringify(updatedOrders));
    
    // 2. Зберігаємо в userProductOrders (для профілю)
    const userOrders = JSON.parse(localStorage.getItem('userProductOrders')) || [];
    const userOrderCopy = {...newOrder};
    
    if (userOrderCopy.type === 'cart') {
      userOrderCopy.items = userOrderCopy.items.map(item => ({
        id: item.id,
        name: item.name,
        brand: item.brand,
        category: item.category,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        total: (item.price * item.quantity).toFixed(2)
      }));
    }
    
    userOrders.push(userOrderCopy);
    localStorage.setItem('userProductOrders', JSON.stringify(userOrders));
    
    // 3. Також зберігаємо в загальні замовлення користувача
    const allUserOrders = JSON.parse(localStorage.getItem('userAllOrders')) || [];
    allUserOrders.push(userOrderCopy);
    localStorage.setItem('userAllOrders', JSON.stringify(allUserOrders));
    
    // Очистити кошик після замовлення
    clearCart();
    
    alert(`✅ Order confirmed!\n\nOrder #${orderId}\nTotal: $${newOrder.total}\n\nYou can view your order in the Profile page.`);
    
    setTimeout(() => {
      window.location.href = '/profile';
    }, 2000);
  };

  const handleSingleOrderSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedProduct || !clientName || !clientPhone || !clientEmail || !shippingAddress) {
      alert('Please fill all required fields');
      return;
    }

    const orderData = {
      type: 'single',
      productName: selectedProduct.name,
      productPrice: selectedProduct.price,
      productBrand: selectedProduct.brand,
      productCategory: selectedProduct.category,
      quantity: 1,
      total: selectedProduct.price,
      clientName,
      clientPhone,
      clientEmail,
      shippingAddress,
      shippingMethod,
      paymentMethod,
      orderNotes
    };
    
    saveOrder(orderData);
    handleCloseModal();
  };

  const handleCartOrderSubmit = (e) => {
    e.preventDefault();
    
    if (!clientName || !clientPhone || !clientEmail || !shippingAddress) {
      alert('Please fill all required fields');
      return;
    }

    const orderData = {
      type: 'cart',
      items: cart,
      total: cartTotal,
      clientName,
      clientPhone,
      clientEmail,
      shippingAddress,
      shippingMethod,
      paymentMethod,
      orderNotes
    };
    
    saveOrder(orderData);
    handleCloseModal();
  };

  // Скидання фільтрів
  const resetFilters = () => {
    setSelectedPriceRanges([]);
    setSelectedBrands([]);
    setSelectedAvailability([]);
    setSelectedCategories([]);
    // Закриваємо всі секції при скиданні
    setExpandedSections({
      priceRange: true,
      brands: true,
      availability: true,
      categories: true
    });
  };

  return (
    <div className="shop-page">
      <Header />
      
      {/* Кнопка кошика в верхньому правому куті */}
      <div className="cart-icon-button" onClick={() => setIsCartModalOpen(true)}>
        <div className="cart-icon-wrapper">
          <svg className="cart-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {cartItemsCount > 0 && (
            <span className="cart-badge">{cartItemsCount}</span>
          )}
        </div>
      </div>

      {/* Головний контейнер */}
      <div className="shop-container">
        {/* Фільтри зліва */}
        <div className="filters-sidebar">
          <div className="filters-container">
            <h2 className="filters-title">Filters</h2>
            
            {/* Цінові діапазони - висувна */}
            <div className="filter-section">
              <div className="filter-section-header" onClick={() => toggleSectionExpand('priceRange')}>
                <h3 className="filter-section-title">Price Range</h3>
                <span className={`expand-icon ${expandedSections.priceRange ? 'expanded' : ''}`}>
                  {expandedSections.priceRange ? '−' : '+'}
                </span>
              </div>
              <div className={`filter-options ${expandedSections.priceRange ? 'expanded' : 'collapsed'}`}>
                {priceRanges.map((range, index) => (
                  <div key={index} className="filter-option">
                    <input 
                      type="checkbox" 
                      id={`price-${index}`}
                      className="filter-checkbox"
                      checked={selectedPriceRanges.includes(range.label)}
                      onChange={() => handlePriceRangeChange(range.label)}
                    />
                    <label htmlFor={`price-${index}`} className="filter-label">
                      {range.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Бренди - висувна */}
            <div className="filter-section">
              <div className="filter-section-header" onClick={() => toggleSectionExpand('brands')}>
                <h3 className="filter-section-title">Popular Brands</h3>
                <span className={`expand-icon ${expandedSections.brands ? 'expanded' : ''}`}>
                  {expandedSections.brands ? '−' : '+'}
                </span>
              </div>
              <div className={`filter-options ${expandedSections.brands ? 'expanded' : 'collapsed'}`}>
                {brands.map((brand, index) => (
                  <div key={index} className="filter-option">
                    <input 
                      type="checkbox" 
                      id={`brand-${index}`}
                      className="filter-checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandChange(brand)}
                    />
                    <label htmlFor={`brand-${index}`} className="filter-label">
                      {brand}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Наявність - висувна */}
            <div className="filter-section">
              <div className="filter-section-header" onClick={() => toggleSectionExpand('availability')}>
                <h3 className="filter-section-title">Availability</h3>
                <span className={`expand-icon ${expandedSections.availability ? 'expanded' : ''}`}>
                  {expandedSections.availability ? '−' : '+'}
                </span>
              </div>
              <div className={`filter-options ${expandedSections.availability ? 'expanded' : 'collapsed'}`}>
                {availabilityOptions.map((option, index) => (
                  <div key={index} className="filter-option">
                    <input 
                      type="checkbox" 
                      id={`availability-${index}`}
                      className="filter-checkbox"
                      checked={selectedAvailability.includes(option)}
                      onChange={() => handleAvailabilityChange(option)}
                    />
                    <label htmlFor={`availability-${index}`} className="filter-label">
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Категорії - висувна */}
            <div className="filter-section">
              <div className="filter-section-header" onClick={() => toggleSectionExpand('categories')}>
                <h3 className="filter-section-title">Categories</h3>
                <span className={`expand-icon ${expandedSections.categories ? 'expanded' : ''}`}>
                  {expandedSections.categories ? '−' : '+'}
                </span>
              </div>
              <div className={`filter-options ${expandedSections.categories ? 'expanded' : 'collapsed'}`}>
                {categories.map((category, index) => (
                  <div key={index} className="filter-option">
                    <input 
                      type="checkbox" 
                      id={`category-${index}`}
                      className="filter-checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                    />
                    <label htmlFor={`category-${index}`} className="filter-label">
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Кнопка скидання */}
            {(selectedPriceRanges.length > 0 || selectedBrands.length > 0 || 
              selectedAvailability.length > 0 || selectedCategories.length > 0) && (
              <button className="reset-btn" onClick={resetFilters}>
                <span className="reset-icon">↻</span>
                Reset Filters
              </button>
            )}

            {/* Кошик в бічній панелі */}
            <div className="cart-summary-sidebar">
              <div className="cart-summary-header">
                <h3 className="filter-section-title">Your Cart</h3>
                <span className="cart-items-count">({cartItemsCount} items)</span>
              </div>
              <div className="cart-summary-info">
                <p className="cart-total-text">Total: <span className="cart-total-price">${cartTotal.toFixed(2)}</span></p>
              </div>
              {cart.length > 0 && (
                <div className="cart-summary-buttons">
                  <button className="cart-btn view-cart-btn" onClick={() => setIsCartModalOpen(true)}>
                    View Cart
                  </button>
                  <button className="cart-btn checkout-btn" onClick={() => {
                    if (cart.length > 0) {
                      setIsCartModalOpen(true);
                    }
                  }}>
                    Checkout
                  </button>
                  <button className="cart-btn clear-cart-btn" onClick={clearCart}>
                    Clear Cart
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Контент з продуктами */}
        <div className="shop-content">
          <div className="shop-card">
            {/* Заголовок */}
            <h1 className="shop-title">IONA Professional Shop</h1>
            <p className="shop-subtitle">
              Premium professional hair care products and tools
            </p>

            {/* Основна частина з двома колонками */}
            <div className="main-content-wrapper">
              {/* Ліва колонка - список продуктів */}
              <div className="products-list-section">
                <div className="list-header">
                  <h2 className="list-title">All Products</h2>
                  <div className="results-count">
                    {filteredProducts.length} products found
                  </div>
                </div>
                
                <div className="products-list">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product, index) => (
                      <div key={index} className="product-item">
                        {/* Картинка зліва */}
                        <div className="product-image-container">
                          <div className="product-image">
                            {product.image ? (
                              <img 
                                src={product.image} 
                                alt={product.name}
                                className="product-image-real"
                              />
                            ) : (
                              <div className="image-placeholder">
                                <span className="image-text">{product.name.charAt(0)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Контент справа */}
                        <div className="product-content">
                          <div className="product-header">
                            <div className="product-title-section">
                              <h3 className="product-name">{product.name}</h3>
                              <span className="product-price">${product.price}</span>
                            </div>
                          </div>
                          <div className="product-info">
                            <span className="product-brand">🏷️ {product.brand}</span>
                            <span className="product-category">📦 {product.category}</span>
                            <span className="product-availability">
                              {product.availability === 'In Stock' ? '✅ In Stock' : 
                               product.availability === 'Pre-Order' ? '⏳ Pre-Order' : 
                               '🏪 Pickup'}
                            </span>
                          </div>
                          <p className="product-description">{product.description}</p>
                          <div className="product-actions">
                            <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
                              Add to Cart
                            </button>
                            <button className="order-now-btn" onClick={() => handleOrderNow(product)}>
                              Order Now
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-results">
                      <p>No products match your filters. Try adjusting your criteria.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Права колонка - акційні пропозиції */}
              <div className="special-offers-sidebar">
                <div className="offers-sidebar-content">
                  <h2 className="offers-title">Special Offers</h2>
                  <p className="offers-subtitle">Limited time deals</p>
                  
                  <div className="offers-list">
                    {specialOffers.map((offer, index) => (
                      <div key={index} className="offer-sidebar-card">
                        <div className="offer-badge">{offer.tag}</div>
                        
                        <div className="offer-image-container">
                          <div className="offer-image">
                            {offer.image ? (
                              <img 
                                src={offer.image} 
                                alt={offer.name}
                                className="offer-image-real"
                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }}
                              />
                            ) : (
                              <div className="image-placeholder">
                                <span className="image-text">{offer.name.charAt(0)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="offer-sidebar-content">
                          <div className="offer-sidebar-header">
                            <h3 className="offer-sidebar-name">{offer.name}</h3>
                            <div className="offer-sidebar-price">
                              <span className="current-price">${offer.price}</span>
                              <span className="original-price">${offer.originalPrice}</span>
                            </div>
                          </div>
                          <p className="offer-sidebar-description">{offer.description}</p>
                          <div className="offer-products">
                            <small>Includes: {offer.products.join(', ')}</small>
                          </div>
                          <button 
                            className="offer-sidebar-btn"
                            onClick={() => {
                              const product = {
                                id: 100 + index,
                                name: offer.name,
                                price: offer.price,
                                brand: 'Special Offer',
                                category: 'Bundle',
                                availability: 'In Stock',
                                description: offer.description
                              };
                              addToCart(product);
                            }}
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="offers-note">
                    <p>🚚 Free shipping on orders over $100</p>
                    <p>✅ 30-day return policy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Модальне вікно кошика */}
      {isCartModalOpen && (
        <div className="cart-modal-overlay" onClick={handleCloseModal}>
          <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Your Shopping Cart</h2>
              <button className="close-modal" onClick={handleCloseModal}>×</button>
            </div>
            
            <div className="modal-body">
              {cart.length > 0 ? (
                <>
                  <div className="cart-items">
                    {cart.map((item, index) => (
                      <div key={index} className="cart-item">
                        <div className="cart-item-image">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="cart-product-image" />
                          ) : (
                            <div className="cart-image-placeholder">
                              <span>{item.name.charAt(0)}</span>
                            </div>
                          )}
                        </div>
                        <div className="cart-item-info">
                          <h4>{item.name}</h4>
                          <p className="cart-item-brand">{item.brand} • {item.category}</p>
                          <p className="cart-item-price">${item.price} each</p>
                        </div>
                        <div className="cart-item-controls">
                          <div className="quantity-controls">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="quantity-btn"
                            >
                              -
                            </button>
                            <span className="quantity">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="quantity-btn"
                            >
                              +
                            </button>
                          </div>
                          <p className="item-total">${(item.price * item.quantity).toFixed(2)}</p>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="remove-btn"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="cart-summary-modal">
                    <div className="summary-row">
                      <span>Subtotal:</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                      <span>Shipping:</span>
                      <span>{cartTotal >= 100 ? 'Free' : '$10.00'}</span>
                    </div>
                    <div className="summary-row total-row">
                      <span>Total:</span>
                      <span>${(cartTotal >= 100 ? cartTotal : cartTotal + 10).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {/* Форма замовлення з кошика */}
                  <form className="order-form" onSubmit={handleCartOrderSubmit}>
                    <div className="form-section">
                      <h3>Shipping Information</h3>
                      <div className="form-group">
                        <input
                          type="text"
                          placeholder="Full Name *"
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="tel"
                          placeholder="Phone Number *"
                          value={clientPhone}
                          onChange={(e) => setClientPhone(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="email"
                          placeholder="Email Address *"
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <textarea
                          placeholder="Shipping Address *"
                          value={shippingAddress}
                          onChange={(e) => setShippingAddress(e.target.value)}
                          rows="3"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-actions">
                      <button type="button" className="cancel-btn" onClick={handleCloseModal}>
                        Continue Shopping
                      </button>
                      <button type="submit" className="submit-btn">
                        Complete Order (${(cartTotal >= 100 ? cartTotal : cartTotal + 10).toFixed(2)})
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="empty-cart">
                  <div className="empty-cart-icon">🛒</div>
                  <p className="empty-cart-text">Your cart is empty</p>
                  <p className="empty-cart-subtext">Add some products to your cart first!</p>
                  <button className="continue-shopping-btn" onClick={handleCloseModal}>
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Модальне вікно замовлення одиничного продукту */}
      {isOrderModalOpen && (
        <div className="order-modal-overlay" onClick={handleCloseModal}>
          <div className="order-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Order Product</h2>
              <button className="close-modal" onClick={handleCloseModal}>×</button>
            </div>
            
            <div className="modal-body">
              {/* Інформація про продукт */}
              {selectedProduct && (
                <div className="product-summary">
                  <h3>{selectedProduct.name}</h3>
                  <div className="product-details">
                    <span className="detail">
                      <strong>Price:</strong> ${selectedProduct.price}
                    </span>
                    <span className="detail">
                      <strong>Brand:</strong> {selectedProduct.brand}
                    </span>
                    <span className="detail">
                      <strong>Category:</strong> {selectedProduct.category}
                    </span>
                    <span className="detail">
                      <strong>Availability:</strong> {selectedProduct.availability}
                    </span>
                  </div>
                </div>
              )}

              {/* Форма замовлення */}
              <form className="order-form" onSubmit={handleSingleOrderSubmit}>
                {/* Персональна інформація */}
                <div className="form-section">
                  <h3>Personal Information</h3>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Full Name *"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="tel"
                      placeholder="Phone Number *"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="email"
                      placeholder="Email Address *"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Адреса доставки */}
                <div className="form-section">
                  <h3>Shipping Details</h3>
                  <div className="form-group">
                    <textarea
                      placeholder="Shipping Address *"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      rows="3"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <h4>Shipping Method</h4>
                    <div className="radio-options">
                      <label className="radio-option">
                        <input
                          type="radio"
                          value="standard"
                          checked={shippingMethod === 'standard'}
                          onChange={(e) => setShippingMethod(e.target.value)}
                        />
                        <span>Standard (5-7 days) - Free</span>
                      </label>
                      <label className="radio-option">
                        <input
                          type="radio"
                          value="express"
                          checked={shippingMethod === 'express'}
                          onChange={(e) => setShippingMethod(e.target.value)}
                        />
                        <span>Express (2-3 days) - $10</span>
                      </label>
                      <label className="radio-option">
                        <input
                          type="radio"
                          value="pickup"
                          checked={shippingMethod === 'pickup'}
                          onChange={(e) => setShippingMethod(e.target.value)}
                        />
                        <span>Salon Pickup - Free</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Спосіб оплати */}
                <div className="form-section">
                  <h3>Payment Method</h3>
                  <div className="radio-options">
                    <label className="radio-option">
                      <input
                        type="radio"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <span>Credit/Debit Card</span>
                    </label>
                    <label className="radio-option">
                      <input
                        type="radio"
                        value="paypal"
                        checked={paymentMethod === 'paypal'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <span>PayPal</span>
                    </label>
                    <label className="radio-option">
                      <input
                        type="radio"
                        value="cash"
                        checked={paymentMethod === 'cash'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <span>Cash on Delivery</span>
                    </label>
                  </div>
                </div>

                {/* Додаткові нотатки */}
                <div className="form-section">
                  <h3>Additional Notes</h3>
                  <div className="form-group">
                    <textarea
                      placeholder="Special instructions or notes..."
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      rows="3"
                    />
                  </div>
                </div>

                {/* Загальна сума */}
                <div className="order-total">
                  <h3>Order Summary</h3>
                  <div className="total-details">
                    <p>Product: <span>${selectedProduct?.price || 0}</span></p>
                    <p>Shipping: <span>{shippingMethod === 'express' ? '$10' : 'Free'}</span></p>
                    <p className="grand-total">Total: <span>${(selectedProduct?.price || 0) + (shippingMethod === 'express' ? 10 : 0)}</span></p>
                  </div>
                </div>

                {/* Кнопки форми */}
                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn">
                    Place Order
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

export default IonaShop;