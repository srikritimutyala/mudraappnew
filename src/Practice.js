import React, { useRef, useEffect, useState } from 'react';

const Practice = () => {
  const videoRef = useRef(null);
  const predictionIntervalRef = useRef(null);
  const timerRef = useRef(null);
  const countdownRef = useRef(null);
  const startLetterArr = ["Pataka", "Tripataka", "Ardhapataka"];

  const [currentLetter, setCurrentLetter] = useState("");
  const [predictedGesture, setPredictedGesture] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [result, setResult] = useState('');
  const [countdown, setCountdown] = useState(null); // For countdown 3, 2, 1
  const [waitingForNewGesture, setWaitingForNewGesture] = useState(false); // To prevent prediction while waiting

  const currentLetterRef = useRef(currentLetter);

  useEffect(() => {
    // Select a random letter from startLetterArr on component mount
    const randomLetter = startLetterArr[Math.floor(Math.random() * startLetterArr.length)];
    setCurrentLetter(randomLetter);

    // Start the 30-second timer and prediction process
    startPrediction();
    startTimer();

    return () => {
      stopPrediction();
      stopTimer();
    };
  }, []);

  useEffect(() => {
    currentLetterRef.current = currentLetter;
    console.log("Random Letter Selected:", currentLetter); // For debugging
  }, [currentLetter]);

  const startTimer = () => {
    // Clear any existing timer before starting a new one
    clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          stopPrediction();
          stopTimer();
          setResult("Time's up! You didn't match the gesture.");
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
  };

  const captureFrame = () => {
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg');
  };

  const predictGesture = async () => {
    try {
      console.log("Current Letter in predictGesture:", currentLetterRef.current);
      const frame = captureFrame();
      const response = await fetch('http://localhost:5000/predict-gesture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: frame }),
      });
      const result = await response.json();
      setPredictedGesture(result.gesture);
      console.log("Predicted Gesture:", result.gesture, " | Current Letter:", currentLetterRef.current);

      if (result.gesture === currentLetterRef.current) {
        console.log("Gesture matched successfully:", currentLetterRef.current);
        stopPrediction();
        stopTimer();
        setResult(`Success! You matched the gesture: ${currentLetterRef.current}`);
        startCountdown(); // Start countdown after success
      }
    } catch (error) {
      console.error('Error predicting gesture:', error);
    }
  };

  const startPrediction = () => {
    predictionIntervalRef.current = setInterval(predictGesture, 1000);
  };

  const stopPrediction = () => {
    clearInterval(predictionIntervalRef.current);
  };

  const startCountdown = () => {
    setWaitingForNewGesture(true); // Disable predictions during countdown
    let countdownTime = 3;

    countdownRef.current = setInterval(() => {
      setCountdown(countdownTime);
      if (countdownTime === 0) {
        clearInterval(countdownRef.current);
        setResult('');
        setCurrentLetter(getRandomLetter());
        setCountdown(null); // Reset countdown
        setWaitingForNewGesture(false); // Enable predictions for new gesture
        startPrediction(); // Start predictions again for new gesture
        startTimer(); // Reset the timer to 30 seconds
        setTimeLeft(30); // Reset time left display
      }
      countdownTime--;
    }, 1000);
  };

  const getRandomLetter = () => {
    const randomLetter = startLetterArr[Math.floor(Math.random() * startLetterArr.length)];
    return randomLetter;
  };

  useEffect(() => {
    const getMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing the camera', error);
      }
    };
    getMedia();

    return () => {
      const tracks = videoRef.current?.srcObject?.getTracks();
      tracks?.forEach((track) => track.stop());
      stopPrediction();
      stopTimer();
    };
  }, []);

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Current Letter: {currentLetter}</h1>
      <p>Time Left: {timeLeft} seconds</p>
      <p>{result}</p>
  
      {/* Show "Next gesture in" only when countdown is active */}
      {countdown !== null && countdown !== 0 && <p>Next gesture in: {countdown} seconds</p>}
    
      {/* Only show this message when waiting for a new gesture */}
      {countdown === 0 && !waitingForNewGesture && <p></p>}
    
      <video ref={videoRef} autoPlay playsInline width="640" height="480" style={{ transform: 'scaleX(-1)' }} />
    
      {/* <p>Predicted Gesture: {predictedGesture}</p> */}
    </div>
  );
  
  
  
};

export default Practice;
