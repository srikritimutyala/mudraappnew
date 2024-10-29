// App.js
import React, { useState } from 'react';
import HomeScreen from './HomeScreen';
import MainInterface from './MainParts';

const App = () => {
  const [showInterface, setShowInterface] = useState(false);

  return (
    <>
      {!showInterface ? (
        <HomeScreen onStart={() => setShowInterface(true)} />
      ) : (
        <MainInterface />
      )}
    </>
  );
};

export default App;
