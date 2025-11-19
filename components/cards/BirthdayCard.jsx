// components/cards/BirthdayCard.jsx
import React from 'react';

export default function BirthdayCard({ isAnimated, scale = 1 }) {
  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transition: 'all 0.3s ease',
      }}
      className={isAnimated ? 'animated' : ''}
    >
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '20px',
        padding: '40px',
        color: 'white',
        textAlign: 'center',
      }}>
        <h1 style={{ fontSize: '2.5em', marginBottom: '20px' }}>
          🎂 ¡Feliz Cumpleaños!
        </h1>
        <p style={{ fontSize: '1.2em', lineHeight: '1.6' }}>
          Que este día esté lleno de alegría y sorpresas maravillosas.
        </p>
      </div>
    </div>
  );
}
