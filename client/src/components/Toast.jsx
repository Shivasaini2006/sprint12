import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

/**
 * Toast Component for showing instant operation feedback.
 * Auto-dismisses after 4 seconds.
 */
const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  const renderIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <AlertCircle size={20} />;
      case 'info':
      default:
        return <Info size={20} />;
    }
  };

  return (
    <div className={`toast toast-${type}`} role="alert" id="toast-notification">
      <span className="toast-icon">{renderIcon()}</span>
      <span className="toast-message" style={{ flex: 1 }}>{message}</span>
      <button 
        onClick={onClose} 
        style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
