import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CalendarClock } from 'lucide-react';

const CountdownTimer = ({ message }) => {
  const COUNTDOWN_DURATION = 72 * 60 * 60 * 1000; // 72 hours in milliseconds
  const STORAGE_KEY = 'physiotherapy_en_countdown_end';

  const getCountdownEndTime = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const now = Date.now();
    
    if (stored) {
      const storedTime = parseInt(stored);

      if (now >= storedTime) {
        const newEndTime = now + COUNTDOWN_DURATION;
        localStorage.setItem(STORAGE_KEY, newEndTime.toString());
        return newEndTime;
      }
      return storedTime;
    } else {
      const newEndTime = now + COUNTDOWN_DURATION;
      localStorage.setItem(STORAGE_KEY, newEndTime.toString());
      return newEndTime;
    }
  };

  const calculateTimeLeft = () => {
    const endTime = getCountdownEndTime();
    const difference = endTime - Date.now();
    
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timerComponents = Object.entries(timeLeft).map(([interval, value]) => ({
    value,
    label:
      interval === 'days'
        ? 'Days'
        : interval === 'hours'
        ? 'Hours'
        : interval === 'minutes'
        ? 'Minutes'
        : 'Seconds',
  }));

  const isOfferActive = timeLeft.days > 0 || timeLeft.hours > 0 || timeLeft.minutes > 0 || timeLeft.seconds > 0;

  if (!isOfferActive) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-muted text-muted-foreground py-3 px-4 text-center text-sm"
      >
        <AlertTriangle className="inline-block mr-2 h-5 w-5 text-destructive" />
        <span dir="ltr">Sorry, this special offer has ended. Stay tuned for future offers!</span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-primary to-accent text-white py-4 px-4 shadow-lg"
    >
      <div className="container mx-auto text-center">
        <div className="flex items-center justify-center mb-2">
          <CalendarClock className="mr-3 h-6 w-6" />
          <p className="text-md md:text-lg font-semibold" dir="ltr">{message}</p>
        </div>
        <div className="flex justify-center items-baseline gap-2 md:gap-4" dir="ltr">
          {timerComponents.map((component, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 + index * 0.1, type: 'spring', stiffness: 120 }}
              className="text-center p-2 bg-white/20 rounded-lg shadow-md min-w-[60px] md:min-w-[70px]"
              dir="ltr"
            >
              <span className="text-2xl md:text-3xl font-bold block" dir="ltr">
                {String(component.value).padStart(2, '0')}
              </span>
              <span className="text-xs md:text-sm block" dir="ltr">{component.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CountdownTimer;
