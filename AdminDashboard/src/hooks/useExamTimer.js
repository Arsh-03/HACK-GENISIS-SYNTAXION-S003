import { useState, useEffect } from 'react';

export function useExamTimer(initialSeconds = 6322) { // 1 hr 45 mins 22 secs default
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const formattedTime = [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0')
  ].join(':');

  return {
    timeLeft,
    formattedTime,
    isRunning,
    setIsRunning,
    progressPercentage: Math.min(100, Math.max(0, ((initialSeconds - timeLeft) / initialSeconds) * 100))
  };
}
