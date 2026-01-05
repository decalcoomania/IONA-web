import React, { createContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { firebaseAuth } from '../firebase';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("AuthContext: Setting up auth state listener");

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed, user:", user);

      if (user) {
        try {
          console.log("User authenticated, UID:", user.uid);

          // Отримуємо дані користувача
          const userDataFromFirebase = await firebaseAuth.getUserData(user.uid);
          console.log("User data from Firebase:", userDataFromFirebase);

          const userProfileData = {
            uid: user.uid,
            name: user.displayName || userDataFromFirebase?.name || user.email?.split('@')[0] || 'User',
            email: user.email,
            phone: user.phoneNumber || userDataFromFirebase?.phone || '',
            avatar: user.photoURL || userDataFromFirebase?.avatar || '',
            joinDate: userDataFromFirebase?.joinDate || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            bio: userDataFromFirebase?.bio || '',
            theme: userDataFromFirebase?.theme || 'blue',
            socialLinks: userDataFromFirebase?.socialLinks || {
              instagram: '',
              facebook: '',
              twitter: ''
            }
          };

          console.log("User profile data to save:", userProfileData);

          // Зберігаємо в localStorage
          localStorage.setItem('hairSalonUserData', JSON.stringify(userProfileData));
          setUserData(userProfileData);
          setCurrentUser(user);

          console.log("Auth state updated successfully");
        } catch (error) {
          console.error("Error loading user data:", error);
          console.error("Error details:", error.code, error.message);
          
          // Якщо не вдалося отримати дані, створюємо базовий профіль
          const basicProfile = {
            uid: user.uid,
            name: user.displayName || user.email?.split('@')[0] || 'User',
            email: user.email,
            phone: user.phoneNumber || '',
            avatar: user.photoURL || '',
            joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            bio: '',
            theme: 'blue',
            socialLinks: {
              instagram: '',
              facebook: '',
              twitter: ''
            }
          };
          
          localStorage.setItem('hairSalonUserData', JSON.stringify(basicProfile));
          setUserData(basicProfile);
          setCurrentUser(user);
        }
      } else {
        console.log("User logged out or not authenticated");
        localStorage.removeItem('hairSalonUserData');
        setUserData(null);
        setCurrentUser(null);
      }
      setLoading(false);
    });

    // Очистка при розмонтуванні
    return () => {
      console.log("AuthContext: Cleaning up auth listener");
      unsubscribe();
    };
  }, []);

  // Функція для логіну
  const login = (user, userProfileData) => {
    localStorage.setItem('hairSalonUserData', JSON.stringify(userProfileData));
    setUserData(userProfileData);
    setCurrentUser(user);
  };

  // Функція для логауту
  const logout = async () => {
    try {
      await firebaseAuth.signOut();
      localStorage.removeItem('hairSalonUserData');
      localStorage.removeItem('hairSalonBookings');
      localStorage.removeItem('favoriteMasters');
      setUserData(null);
      setCurrentUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Функція для оновлення даних користувача
  const updateUserProfile = async (data) => {
    try {
      if (currentUser) {
        // Оновлюємо в Firebase
        await firebaseAuth.updateUserData(currentUser.uid, data);
        
        // Оновлюємо локальний стан
        const updatedData = { ...userData, ...data };
        setUserData(updatedData);
        localStorage.setItem('hairSalonUserData', JSON.stringify(updatedData));
        
        return { success: true };
      }
      return { success: false, error: "No user logged in" };
    } catch (error) {
      console.error("Error updating user profile:", error);
      return { success: false, error: error.message };
    }
  };

  // Функція для отримання даних користувача
  const getUserProfile = async () => {
    try {
      if (currentUser) {
        const data = await firebaseAuth.getUserData(currentUser.uid);
        return data;
      }
      return null;
    } catch (error) {
      console.error("Error getting user profile:", error);
      return null;
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading IONA...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{
      currentUser,
      userData,
      login,
      logout,
      updateUserData: firebaseAuth.updateUserData,
      getUserData: firebaseAuth.getUserData,
      updateUserProfile, // Додана нова функція
      getUserProfile     // Додана нова функція
    }}>
      {children}
    </AuthContext.Provider>
  );
};