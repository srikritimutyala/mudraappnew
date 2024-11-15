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
  );
};

export default App;
