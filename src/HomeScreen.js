// LandingScreen.js
import React from 'react';

const HomeScreen = ({ onStart }) => (
  <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
    <button onClick={onStart} style={{ padding: '20px', fontSize: '20px' }}>
     other stuff
    </button>
  </div>
);

export default HomeScreen;
