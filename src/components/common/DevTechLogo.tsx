"use client";
import React from 'react';
import { useEmployeeContext } from '../../context/EmployeeContext';

interface DevTechLogoProps {
  variant?: 'color' | 'white';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  logoUrl?: string;
}

export const DevTechLogo: React.FC<DevTechLogoProps> = ({
  variant = 'color',
  className = '',
  size = 'md',
  logoUrl,
}) => {
  let contextLogo: string | undefined;
  try {
    const { settings } = useEmployeeContext();
    contextLogo = settings?.companyLogo;
  } catch (e) {
    // If rendered outside EmployeeProvider
  }

  const activeLogo = logoUrl || contextLogo;

  // Prominent Logo Heights
  const heightPx = {
    sm: 42,
    md: 56,
    lg: 72,
  }[size];

  if (activeLogo) {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <img
          src={activeLogo}
          alt="Company Logo"
          style={{ height: `${heightPx}px`, maxHeight: '80px', objectFit: 'contain' }}
          className="w-auto drop-shadow-sm"
        />
      </div>
    );
  }

  const isWhite = variant === 'white';
  const textColor = isWhite ? '#FFFFFF' : '#0077FF';
  const subtitleColor = isWhite ? '#E2E8F0' : '#111827';
  const circuitColor = isWhite ? '#FFFFFF' : '#1F2937';
  const handColor = isWhite ? '#38BDF8' : '#0077FF';

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <svg
        width="260"
        height="70"
        viewBox="0 0 360 95"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', maxWidth: '270px', height: 'auto' }}
      >
        {/* Left Circuit Icon with Hand Gesture */}
        <g id="circuit-hand-logo">
          {/* Black Circuit Lines & Tree Branches */}
          <path d="M48 58 V36 L32 20 M48 36 L64 20 M48 46 L24 35 M48 46 L72 35" stroke={circuitColor} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          
          {/* Top 3 Nodes */}
          <circle cx="32" cy="18" r="4.5" fill="none" stroke={circuitColor} strokeWidth="3.2" />
          <circle cx="48" cy="12" r="4.5" fill="none" stroke={circuitColor} strokeWidth="3.2" />
          <circle cx="64" cy="18" r="4.5" fill="none" stroke={circuitColor} strokeWidth="3.2" />
          
          {/* Upper Side Nodes */}
          <circle cx="22" cy="34" r="4.5" fill="none" stroke={circuitColor} strokeWidth="3.2" />
          <circle cx="74" cy="34" r="4.5" fill="none" stroke={circuitColor} strokeWidth="3.2" />

          {/* Lower Side Branch Nodes */}
          <path d="M34 52 L20 54" stroke={circuitColor} strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="16" cy="54" r="4.5" fill="none" stroke={circuitColor} strokeWidth="3.2" />
          
          <path d="M62 52 L76 54" stroke={circuitColor} strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="80" cy="54" r="4.5" fill="none" stroke={circuitColor} strokeWidth="3.2" />

          {/* Cyan/Sky Blue Hand Outline Pointing Finger */}
          <path
            d="M38 82 V55 C38 49 45 49 45 55 V68 H47 C50 68 50 64 48 61 C52 61 54 65 52 68 C55 68 57 71 55 74 C57 75 57 80 52 82 Z"
            fill="none"
            stroke={handColor}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* Brand Text: DEVTECH */}
        <text
          x="100"
          y="50"
          fill={textColor}
          fontFamily="Arial, Helvetica, sans-serif"
          fontWeight="900"
          fontSize="44"
        >
          DEVTECH
        </text>

        {/* Subtitle Text: YOUR VISION OUR TECH */}
        <text
          x="101"
          y="75"
          fill={subtitleColor}
          fontFamily="Arial, Helvetica, sans-serif"
          fontWeight="800"
          fontSize="15"
        >
          YOUR VISION OUR TECH
        </text>
      </svg>
    </div>
  );
};
