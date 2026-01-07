import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import Services from './pages/Services/Services';
import IonaShop from './pages/IonaShop/IonaShop';
import Masters from './pages/Masters/Masters';
import MasterReviews from './pages/MasterReviews/MasterReviews';

import Profile from './pages/Profile/Profile';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import './App.css';

// Компонент захисту маршрутів
const ProtectedRoute = ({ children }) => {
  const { currentUser } = React.useContext(AuthContext);
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          {/* Публічні маршрути */}
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/iona-shop" element={<IonaShop />} />
          <Route path="/masters" element={<Masters />} />
          <Route path="/master/:masterId/reviews" element={<MasterReviews />} />

          
          {/* Авторизація */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Захищені маршрути */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          {/* Редирект на головну для неіснуючих маршрутів */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;