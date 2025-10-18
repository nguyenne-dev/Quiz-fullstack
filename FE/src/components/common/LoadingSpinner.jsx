import React from 'react';

export const LoadingSpinner = ({ size = 'medium', message = 'Đang tải...' }) => {
  const sizeMap = {
    small: { width: '24px', height: '24px', borderWidth: '3px' },
    medium: { width: '42px', height: '42px', borderWidth: '4px' },
    large: { width: '64px', height: '64px', borderWidth: '5px' },
  };

  const currentSize = sizeMap[size] || sizeMap.medium;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      gap: '16px',
      minHeight: '200px'
    }}>
      <div
        className="animate-spin"
        style={{
          width: currentSize.width,
          height: currentSize.height,
          border: `${currentSize.borderWidth} solid var(--border-card)`,
          borderTopColor: 'var(--primary)',
          borderRadius: '50%',
          boxShadow: '0 0 15px rgba(99, 102, 241, 0.3)'
        }}
      />
      {message && (
        <p style={{
          fontSize: '0.95rem',
          color: 'var(--text-muted)',
          fontWeight: '500'
        }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
