// BookingModal.js
import React, { useState } from 'react';
import '../pages/Services/Services.css';

const BookingModal = ({ isOpen, onClose, service }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Доступні часові слоти
  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
    '05:00 PM', '06:00 PM', '07:00 PM'
  ];

  // Генеруємо дати на наступні 14 днів
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Пропускаємо неділі
      if (date.getDay() !== 0) {
        const formattedDate = date.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        });
        const dateValue = date.toISOString().split('T')[0];
        dates.push({ label: formattedDate, value: dateValue });
      }
    }
    
    return dates;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Тут буде логіка відправки форми
    alert(`Booking confirmed!\nService: ${service?.name}\nDate: ${selectedDate}\nTime: ${selectedTime}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Book Appointment</h2>
          <button className="close-modal" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          {/* Інформація про послугу */}
          <div className="service-info-modal">
            <h3>{service?.name}</h3>
            <div className="service-details-modal">
              <span>Price: <strong>${service?.price}</strong></span>
              <span>Duration: <strong>{service?.duration} minutes</strong></span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="booking-form">
            {/* Особиста інформація */}
            <div className="form-section">
              <h3 className="form-section-title">Your Information</h3>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="full-width"
              />
            </div>

            {/* Дата та час */}
            <div className="form-section">
              <h3 className="form-section-title">Select Date & Time</h3>
              
              {/* Календар */}
              <div className="calendar-section">
                <div className="calendar-header">
                  <h4>Select Date</h4>
                  <span>Available dates for next 14 days</span>
                </div>
                <div className="dates-grid">
                  {generateDates().map((date) => (
                    <button
                      key={date.value}
                      type="button"
                      className={`date-btn ${selectedDate === date.value ? 'selected' : ''}`}
                      onClick={() => setSelectedDate(date.value)}
                    >
                      {date.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Час */}
              <div className="time-section">
                <h4>Select Time</h4>
                <div className="time-slots">
                  {timeSlots.map((timeSlot) => (
                    <button
                      key={timeSlot}
                      type="button"
                      className={`time-btn ${selectedTime === timeSlot ? 'selected' : ''}`}
                      onClick={() => setSelectedTime(timeSlot)}
                    >
                      {timeSlot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Кнопки */}
            <div className="modal-actions">
              <button type="button" className="cancel-btn" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="submit-btn" disabled={!selectedDate || !selectedTime}>
                Confirm Booking
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;