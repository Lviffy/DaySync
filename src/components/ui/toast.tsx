import React, { useState, useEffect } from 'react';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const baseClasses = 'fixed top-4 right-4 z-50 px-4 py-2 rounded shadow-lg transition-all duration-300';
  
  const typeClasses = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
      {message}
    </div>
  );
};

export const useToast = () => {
  const [toasts, setToasts] = useState<Array<ToastProps & { id: string }>>([]);

  const addToast = (props: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((currentToasts) => [...currentToasts, { ...props, id }]);
    
    setTimeout(() => {
      removeToast(id);
    }, props.duration || 3000);
    
    return id;
  };

  const removeToast = (id: string) => {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
  };

  return { addToast, removeToast, toasts };
};

export default Toast;
