<<<<<<< HEAD
import React, { useState } from 'react';
import HomeScreen from './HomeScreen';
import Learning from './Learning';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState("home"); // 'home' or 'learning'

  const startLearning = () => {
    setCurrentScreen("learning");
  };

  const returnToHome = () => {
    setCurrentScreen("home");
  };

  return (
    <div>
      {currentScreen === "home" ? (
        <HomeScreen onStart={startLearning} />
      ) : (
        <Learning onFinish={returnToHome} />
      )}
    </div>
=======
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
>>>>>>> 27aa85814958c0eb95dd4816ef2f9336c063889b
  );
};

export default App;
