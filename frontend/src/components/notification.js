import { useState, useEffect } from 'react';

export default function Notification({ message, type = 'success', duration = 3000, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        onClose();
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const styles = {
    success: 'bg-green-600',
    error: 'bg-red-900',
    info: 'bg-blue-600',
    warning: 'bg-yellow-600',
  };

  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️',
  };

  return (
    <div className={`fixed top-4 right-4 ${styles[type]} text-white px-6 py-3 rounded-md shadow-lg z-50 animate-fade-in`}>
      <div className="flex items-center gap-2">
        <span className="text-xl">{icons[type]}</span>
        <span>{message}</span>
      </div>
    </div>
  );
}
