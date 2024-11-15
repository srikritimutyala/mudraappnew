// MainInterface.js
import React, { useRef, useEffect, useState } from 'react';

const MainInterface = () => {
  const videoRef = useRef(null);
  const captureIntervalRef = useRef(null);
  const predictionIntervalRef = useRef(null);

  const [isCapturing, setIsCapturing] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const [classId, setClassId] = useState(null);
  const [status, setStatus] = useState('');
  const [predictedGesture, setPredictedGesture] = useState('');

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
      const frame = captureFrame();
      const response = await fetch('http://localhost:5000/predict-gesture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: frame }),
      });
      const result = await response.json();
      setPredictedGesture(result.gesture);
    } catch (error) {
      console.error('Error predicting gesture:', error);
    }
  };

  const startPrediction = () => {
    setIsPredicting(true);
    predictionIntervalRef.current = setInterval(predictGesture, 1000);
  };

  const stopPrediction = () => {
    setIsPredicting(false);
    clearInterval(predictionIntervalRef.current);
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
      clearInterval(predictionIntervalRef.current);
    };
  }, []);

  return (
    <div>
      <h1>Camera Feed</h1>
      <video ref={videoRef} autoPlay playsInline width="640" height="480" style={{ transform: 'scaleX(-1)' }} />

      <button onClick={startPrediction} disabled={isPredicting} style={{ margin: '10px' }}>
        Start Prediction
      </button>
      <button onClick={stopPrediction} disabled={!isPredicting} style={{ margin: '10px' }}>
        Stop Prediction
      </button>

      <p>Status: {status}</p>
      <p>Predicted Gesture: {predictedGesture}</p>
    </div>
  );
};

export default MainInterface;
