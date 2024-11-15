<<<<<<< HEAD
// HomeScreen.js
import React, { useState } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import Practice from './Practice'; // Import Practice component

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDcTTztGaaDp5ErS0bpxN-cI4OAHZPxEn8",
  authDomain: "mudrawebsite-8d67f.firebaseapp.com",
  projectId: "mudrawebsite-8d67f",
  storageBucket: "mudrawebsite-8d67f.appspot.com",
  messagingSenderId: "935807910357",
  appId: "1:935807910357:web:766a8a274ddfa48c53fd5c",
  measurementId: "G-MCR0XMV6QR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

const signIn = async (onStart) => {
  try {
    await signInWithPopup(auth, new GoogleAuthProvider());
    onStart(); // Navigate to the Learn component after successful sign-in
  } catch (error) {
    console.error('Error signing in:', error);
  }
};

const HomeScreen = ({ onStart }) => {
  const [screen, setScreen] = useState('home'); // 'home' by default

  if (screen === 'practice') {
    return <Practice />; // Render Practice component if "Practice" button is clicked
  }

  return (
    <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
      <button
        onClick={() => signIn(onStart)}
        style={{ padding: '20px', fontSize: '20px', marginRight: '10px' }}
      >
        Other Stuff
      </button>
      <button
        onClick={() => signIn(onStart)}
        style={{ marginTop: '30px', fontFamily: 'Lilita One, sans-serif', color: '#003566' }}
      >
        Continue with Google
      </button>
      <button
        onClick={() => setScreen('practice')} // Set screen state to 'practice' when clicked
        style={{ padding: '20px', fontSize: '20px', marginRight: '10px' }}
      >
        Practice
      </button>
    </div>
  );
};
=======
// LandingScreen.js
import React from 'react';

const HomeScreen = ({ onStart }) => (
  <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
    <button onClick={onStart} style={{ padding: '20px', fontSize: '20px' }}>
     other stuff
    </button>
  </div>
);
>>>>>>> 27aa85814958c0eb95dd4816ef2f9336c063889b

export default HomeScreen;
