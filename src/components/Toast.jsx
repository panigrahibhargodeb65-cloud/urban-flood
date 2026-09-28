import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

export default function Toast({ message, onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="toast-notification">
      <CheckCircle2 size={18} className="toast-icon" />
      <span className="toast-message">{message}</span>
      <button className="toast-close-btn" onClick={onClose}>
        <X size={14} />
      </button>
    </div>
  );
}
