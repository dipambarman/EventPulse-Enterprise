import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '350px'
      }}>
        {toasts.map((toast) => {
          let bg = '#2d3436';
          let border = '#636e72';
          if (toast.type === 'success') {
            bg = '#00b894';
            border = '#55efc4';
          } else if (toast.type === 'error') {
            bg = '#d63031';
            border = '#ff7675';
          } else if (toast.type === 'warning') {
            bg = '#fdcb6e';
            border = '#ffeaa7';
          }

          return (
            <div
              key={toast.id}
              onClick={() => removeToast(toast.id)}
              style={{
                background: bg,
                color: '#ffffff',
                padding: '12px 18px',
                borderRadius: '8px',
                boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                fontSize: '0.9rem',
                fontWeight: 500,
                cursor: 'pointer',
                borderLeft: `4px solid ${border}`,
                animation: 'slideInRight 0.3s ease-out'
              }}
            >
              {toast.message}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
