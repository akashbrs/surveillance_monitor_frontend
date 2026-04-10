import React from 'react';

export const AuthBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* Perspective Grid at the bottom */}
      <div className="login-perspective-grid" />
      
      {/* Large Center Glow */}
      <div className="login-center-glow" />

      {/* Main Circuit SVG */}
      <svg 
        className="absolute inset-0 w-full h-full opacity-30 dark:opacity-60" 
        viewBox="0 0 1440 900" 
        preserveAspectRatio="xMidYMid slice" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="blue-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="red-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.8" />
          </linearGradient>
          <filter id="soft-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* LEFT SIDE (BLUE) */}
        <g filter="url(#soft-glow)">
          {/* Horizontal multi-segments */}
          <path d="M0,150 L200,150 L240,190 L500,190" stroke="url(#blue-grad)" strokeWidth="1" fill="none" />
          <path d="M0,350 L300,350 L360,410 L480,410" stroke="url(#blue-grad)" strokeWidth="1.5" fill="none" />
          <path d="M0,600 L150,600 L210,660 L450,660" stroke="url(#blue-grad)" strokeWidth="1" fill="none" />
          <path d="M0,780 L280,780 L320,820 L520,820" stroke="url(#blue-grad)" strokeWidth="1" fill="none" />
          
          {/* Decorative Junctions */}
          <circle cx="200" cy="150" r="1.5" fill="#3b82f6" />
          <circle cx="300" cy="350" r="2.5" fill="#3b82f6" />
          <circle cx="150" cy="600" r="1.5" fill="#3b82f6" />
          
          {/* Extra faint lines */}
          <path d="M100,0 L100,150 L120,170" stroke="#3b82f6" strokeWidth="0.5" strokeOpacity="0.2" fill="none" />
          <path d="M350,900 L350,820 L370,800" stroke="#3b82f6" strokeWidth="0.5" strokeOpacity="0.2" fill="none" />
        </g>

        {/* RIGHT SIDE (RED) */}
        <g filter="url(#soft-glow)">
          {/* Horizontal multi-segments */}
          <path d="M1440,200 L1200,200 L1160,240 L900,240" stroke="url(#red-grad)" strokeWidth="1" fill="none" />
          <path d="M1440,450 L1100,450 L1040,390 L850,390" stroke="url(#red-grad)" strokeWidth="1.5" fill="none" />
          <path d="M1440,680 L1250,680 L1190,620 L950,620" stroke="url(#red-grad)" strokeWidth="1" fill="none" />
          <path d="M1440,850 L1150,850 L1110,810 L880,810" stroke="url(#red-grad)" strokeWidth="1" fill="none" />

          {/* Decorative Junctions */}
          <circle cx="1200" cy="200" r="1.5" fill="#ef4444" />
          <circle cx="1100" cy="450" r="2.5" fill="#ef4444" />
          <circle cx="1250" cy="680" r="1.5" fill="#ef4444" />

          {/* Extra faint lines */}
          <path d="M1300,0 L1300,200 L1280,220" stroke="#ef4444" strokeWidth="0.5" strokeOpacity="0.2" fill="none" />
          <path d="M1050,900 L1050,810 L1030,790" stroke="#ef4444" strokeWidth="0.5" strokeOpacity="0.2" fill="none" />
        </g>

        {/* Middle Cross-hatch/Particles */}
        <g opacity="0.1">
          <circle cx="720" cy="450" r="1.5" fill="#3b82f6" className="animate-pulse" />
          <circle cx="680" cy="380" r="1" fill="#ef4444" className="animate-pulse" />
          <circle cx="760" cy="520" r="1.2" fill="#3b82f6" className="animate-pulse" />
        </g>
      </svg>
    </div>
  );
};
