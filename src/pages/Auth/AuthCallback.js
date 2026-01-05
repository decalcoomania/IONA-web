import React, { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../App';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const handleCallback = async () => {
      // В реальному додатку тут буде обробка OAuth callback
      // Парсинг параметрів з URL
      const params = new URLSearchParams(location.search);
      const code = params.get('code');
      const provider = params.get('state'); // або зберігати у state

      try {
        // Імітація обміну code на token
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockResponse = {
          token: 'oauth-mock-token',
          user: {
            id: Date.now(),
            name: provider === 'google' ? 'Google User' : 'Facebook User',
            email: `${provider}@example.com`,
            avatar: '',
            joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
          }
        };

        // Зберігаємо базові дані профілю
        const userProfileData = {
          name: mockResponse.user.name,
          email: mockResponse.user.email,
          phone: '',
          avatar: '',
          joinDate: mockResponse.user.joinDate,
          bio: '',
          theme: 'blue',
          socialLinks: {
            instagram: '',
            facebook: '',
            twitter: ''
          }
        };
        
        localStorage.setItem('hairSalonUserData', JSON.stringify(userProfileData));
        login(mockResponse.token, mockResponse.user);
        navigate('/profile');
        
      } catch (error) {
        console.error('OAuth callback error:', error);
        navigate('/login?error=oauth_failed');
      }
    };

    handleCallback();
  }, [location, navigate, login]);

  return (
    <div className="loading-screen">
      <div className="loading-spinner"></div>
      <p>Completing authentication...</p>
    </div>
  );
};

export default AuthCallback;