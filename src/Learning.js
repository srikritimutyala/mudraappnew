// Learning.js
import React, { useRef, useEffect, useState } from 'react';

const Learning = ({ onFinish }) => {
  const videoRef = useRef(null);
  const [isInitialScreen, setIsInitialScreen] = useState(true);
  const [isCapturing, setIsCapturing] = useState(false);
  const intervalRef = useRef(null);
  const imgArr = ["Pataka.jpeg", "tripataka.jpeg", "ardhapataka.jpeg"];
  const letterArr = ["Pataka", "Tripataka", "Ardhapataka"];
  const [index, setIndex] = useState(0);

  const initializeVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing the camera:", error);
    }
  };

  const startCapture = () => {
    setIsCapturing(true);
    initializeVideo();
  };

  const stopCapture = () => {
    setIsCapturing(false);
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const captureFrame = () => {
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg');
  };

  const sendFrameToServer = async (frame) => {
    try {
      await fetch('http://localhost:5000/process-frame', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: frame, class: index }),
      });
    } catch (error) {
      console.error("Error sending frame to Flask:", error);
    }
  };

  useEffect(() => {
    if (isCapturing) {
      intervalRef.current = setInterval(() => {
        const frame = captureFrame();
        sendFrameToServer(frame);
      }, 1000);

      setTimeout(() => {
        stopCapture();
        clearInterval(intervalRef.current);

        setIndex((prevIndex) => (prevIndex + 1));
        setIsInitialScreen(true);
      }, 30000);
    }

    return () => clearInterval(intervalRef.current);
  }, [isCapturing]);

  const completeProcess = async () => {
    try {
      await fetch('http://localhost:5000/process-images', { method: 'POST' });
      await fetch('http://localhost:5000/train-model', { method: 'POST' });
      onFinish(); // Navigate back to Home screen after processing is complete
    } catch (error) {
      console.error("Error completing process:", error);
    }
  };

  useEffect(() => {
    console.log(index)
    if (index >= imgArr.length) {
      console.log("running inside")

      completeProcess();
    }
  }, [index]);

  return (
    <div style={{ textAlign: 'center', paddingTop: '50px' }}>
      {isInitialScreen ? (
        <div>
          <p>This is the letter {letterArr[index]}</p>
          <img src={`/exampleLetters/${imgArr[index]}`} alt="Placeholder" style={{ width: '300px', marginBottom: '20px' }} />
          <button onClick={() => { setIsInitialScreen(false); startCapture(); }} style={{ padding: '10px 20px', fontSize: '16px' }}>
            Start Collecting Images
          </button>
        </div>
      ) : (
        <div>
          <h1>Camera Feed</h1>
          <video ref={videoRef} autoPlay playsInline width="640" height="480" style={{ transform: 'scaleX(-1)' }} />
        </div>
      )}
    </div>
  );
};

export default Learning;
