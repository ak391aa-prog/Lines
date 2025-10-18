import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        // Allow animation to finish before clearing message
        setTimeout(onClose, 300); 
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-20 sm:bottom-5 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-slate-900 text-white text-base font-semibold rounded-full shadow-lg ${
        isVisible ? 'animate-toast-in' : 'animate-toast-out'
      }`}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
};
