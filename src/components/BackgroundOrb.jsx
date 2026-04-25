"use client"
// components/BackgroundOrb.jsx
import React from 'react';

const BackgroundOrb = ({ className = "" }) => {
  return (
    <div 
      className={`fixed -z-0 pointer-events-none select-none ${className}`}
      style={{
        width: '800px', // Slightly larger for a softer fade
        height: '800px',
        borderRadius: '50%',
        // We use a very soft grey to white radial gradient
        background: 'radial-gradient(circle, rgba(200, 200, 200, 0.2) 0%, rgba(255, 255, 255, 0) 70%)',
        // 'will-change-transform' helps the browser render blur smoothly
        willChange: 'transform',
      }}
    />
  );
};

export default BackgroundOrb;