import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Додайте цю функцію для перевірки підключення
export const checkFirebaseConnection = async () => {
  try {
    console.log("Checking Firebase connection...");
    console.log("Firebase config:", firebaseConfig);
    console.log("App initialized:", app.name);
    console.log("Auth available:", auth ? "Yes" : "No");
    console.log("Firestore available:", db ? "Yes" : "No");
    return true;
  } catch (error) {
    console.error("Firebase connection error:", error);
    return false;
  }
};

// Викликайте на початку додатку
checkFirebaseConnection();
// Ваша конфігурація Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBm8ta-7QzwdBWHbC7n_-Ip7kUDE7Kdd6U",
  authDomain: "awesome-39bf3.firebaseapp.com",
  projectId: "awesome-39bf3",
  storageBucket: "awesome-39bf3.firebasestorage.app",
  messagingSenderId: "1069642133546",
  appId: "1:1069642133546:web:2f7e666c51712c996a5353",
  measurementId: "G-RQT4QLTGF3"
};

// Ініціалізація Firebase
const app = initializeApp(firebaseConfig);

// Експортуємо сервіси
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

// Допоміжні функції
export const firebaseAuth = {
  // Реєстрація
  async signUp(email, password, userData) {
    const { createUserWithEmailAndPassword } = await import("firebase/auth");
    const { doc, setDoc } = await import("firebase/firestore");
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await setDoc(doc(db, "users", user.uid), {
        ...userData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      return user;
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  },

  // Вхід
  async signIn(email, password) {
    const { signInWithEmailAndPassword } = await import("firebase/auth");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  },

  // В firebase.js
async signInWithGoogle() {
  const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
  const { doc, getDoc, setDoc } = await import("firebase/firestore");
  
  try {
    console.log("Starting Google sign in...");
    const provider = new GoogleAuthProvider();
    
    // Додайте додаткові параметри, якщо потрібно
    provider.addScope('email');
    provider.addScope('profile');
    
    console.log("Opening Google popup...");
    const result = await signInWithPopup(auth, provider);
    console.log("Google sign in successful, result:", result);
    
    const user = result.user;
    console.log("User from Google:", user);
    console.log("User ID:", user.uid);
    console.log("User email:", user.email);
    console.log("User display name:", user.displayName);
    console.log("User photo URL:", user.photoURL);
    
    // Перевірка, чи існує користувач у Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    console.log("User exists in Firestore:", userDoc.exists());
    
    if (!userDoc.exists()) {
      console.log("Creating new user in Firestore...");
      const userData = {
        name: user.displayName || user.email?.split('@')[0] || 'User',
        email: user.email,
        avatar: user.photoURL || '',
        phone: user.phoneNumber || '',
        joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        bio: '',
        theme: 'blue',
        socialLinks: {
          instagram: '',
          facebook: '',
          twitter: ''
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      console.log("User data to save:", userData);
      await setDoc(doc(db, "users", user.uid), userData);
      console.log("User saved to Firestore successfully");
    } else {
      console.log("User already exists in Firestore, data:", userDoc.data());
    }
    
    return user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    console.error("Full error object:", error);
    
    // Більш конкретні повідомлення про помилки
    if (error.code === 'auth/popup-blocked') {
      throw new Error("Google popup was blocked by your browser. Please allow popups for this site.");
    } else if (error.code === 'auth/popup-closed-by-user') {
      throw new Error("Google sign in was cancelled. Please try again.");
    } else if (error.code === 'auth/network-request-failed') {
      throw new Error("Network error. Please check your internet connection.");
    } else if (error.code === 'auth/unauthorized-domain') {
      throw new Error("This domain is not authorized. Please check Firebase configuration.");
    }
    
    throw error;
  }
},
  // Вихід
  async signOut() {
    const { signOut } = await import("firebase/auth");
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  },

  // Отримати дані користувача
  async getUserData(userId) {
    const { doc, getDoc } = await import("firebase/firestore");
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      return userDoc.exists() ? userDoc.data() : null;
    } catch (error) {
      console.error("Error getting user data:", error);
      throw error;
    }
  },

  // Оновити дані користувача
  async updateUserData(userId, data) {
    const { doc, setDoc } = await import("firebase/firestore");
    try {
      await setDoc(doc(db, "users", userId), {
        ...data,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      console.error("Error updating user data:", error);
      throw error;
    }
  }
};

export default app;