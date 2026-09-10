import React from 'react';
import { LogoTheme } from '../types';

interface LogoVectorProps {
  theme?: LogoTheme;
  showGlow?: boolean;
  transparentBg?: boolean;
  className?: string;
  id?: string;
}

export const defaultThemes: LogoTheme[] = [
  {
    id: 'original',
    name: 'Original Electric',
    topColor: '#00d2ff',
    midColor: '#5c12e8',
    botColor: '#ff1493',
    glowColor: '#7928ca',
  },
  {
    id: 'cyber-neon',
    name: 'Cyber Cyan & Magenta',
    topColor: '#00ffff',
    midColor: '#8a2be2',
    botColor: '#ff007f',
    glowColor: '#00ffff',
  },
  {
    id: 'sunset',
    name: 'Solar Flare',
    topColor: '#ff9900',
    midColor: '#ff0066',
    botColor: '#6a0dad',
    glowColor: '#ff0066',
  },
  {
    id: 'aurora',
    name: 'Northern Aurora',
    topColor: '#00ffcc',
    midColor: '#0099ff',
    botColor: '#7b1fa2',
    glowColor: '#00ffcc',
  },
  {
    id: 'platinum',
    name: 'Liquid Platinum',
    topColor: '#e2e8f0',
    midColor: '#64748b',
    botColor: '#cbd5e1',
    glowColor: '#94a3b8',
  },
];

export const LogoVector: React.FC<LogoVectorProps> = ({
  theme = defaultThemes[0],
  showGlow = true,
  transparentBg = false,
  className = 'w-full h-full',
  id = 'master-logo-svg',
}) => {
  return (
    <svg
      id={id}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1000 1000"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* Background gradient if needed */}
        {!transparentBg && (
          <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#080811" />
            <stop offset="100%" stopColor="#000000" />
          </radialGradient>
        )}

        {/* Ambient Bloom Filter */}
        <filter id="neonBloom" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="35" result="blur1" />
          <feGaussianBlur stdDeviation="70" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Subtle Drop Shadow for Ribbon Fold Depth */}
        <filter id="ribbonShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="-10" dy="12" stdDeviation="18" floodColor="#000000" floodOpacity="0.85" />
        </filter>

        {/* Main Ribbon Gradient: Top Upper Sweep */}
        <linearGradient id="topSweepGrad" x1="0.8" y1="0.2" x2="0.2" y2="0.65">
          <stop offset="0%" stopColor={theme.topColor} />
          <stop offset="35%" stopColor="#0080ff" />
          <stop offset="70%" stopColor={theme.midColor} />
          <stop offset="100%" stopColor="#3d0a99" />
        </linearGradient>

        {/* Inner Fold Gradient */}
        <linearGradient id="innerFoldGrad" x1="0.3" y1="0.3" x2="0.7" y2="0.7">
          <stop offset="0%" stopColor="#0055ff" />
          <stop offset="50%" stopColor="#3b089a" />
          <stop offset="100%" stopColor="#150033" />
        </linearGradient>

        {/* Lower Ribbon Sweep Gradient */}
        <linearGradient id="bottomSweepGrad" x1="0.3" y1="0.35" x2="0.65" y2="0.9">
          <stop offset="0%" stopColor="#3a0996" />
          <stop offset="25%" stopColor={theme.midColor} />
          <stop offset="55%" stopColor="#b50fb8" />
          <stop offset="85%" stopColor={theme.botColor} />
          <stop offset="100%" stopColor="#ff4081" />
        </linearGradient>

        {/* Front Turn Highlight Gradient */}
        <linearGradient id="frontHighlightGrad" x1="0.2" y1="0.5" x2="0.8" y2="0.6">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
          <stop offset="40%" stopColor="#ffffff" stopOpacity="0.0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
        </linearGradient>

        {/* Upper Cap Specular Sheen */}
        <linearGradient id="capSheen" x1="0.5" y1="0.1" x2="0.6" y2="0.4">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Background layer */}
      {!transparentBg && (
        <rect width="1000" height="1000" fill="#000000" rx="0" />
      )}

      {/* Ambient Glow behind ribbon if enabled */}
      {showGlow && (
        <g opacity="0.4" filter="url(#neonBloom)">
          <path
            d="M560 250 C 440 220 330 310 330 460 C 330 560 410 600 500 640 C 600 680 660 740 590 820 C 530 890 400 850 380 730"
            fill="none"
            stroke={theme.glowColor}
            strokeWidth="110"
            strokeLinecap="round"
          />
        </g>
      )}

      {/* 3D Ribbon Letter "S" Structure */}
      <g id="ribbon-geometry">
        {/* PART 1: Top Back Turn & Inner Depth Fold */}
        <path
          d="M 530 365
             C 500 395, 465 445, 480 505
             C 495 565, 545 615, 560 670
             C 540 685, 510 675, 490 640
             C 450 575, 420 515, 440 435
             C 455 375, 490 340, 530 365 Z"
          fill="url(#innerFoldGrad)"
          opacity="0.95"
        />

        {/* PART 2: Upper Ribbon Loop (starts at top right cap, swoops up and curves down) */}
        <path
          d="M 590 245
             C 630 270, 620 320, 565 345
             C 490 380, 440 430, 435 480
             C 425 435, 435 385, 475 320
             C 435 340, 395 380, 365 440
             C 315 540, 345 630, 455 690
             C 400 635, 365 570, 360 495
             C 355 410, 415 320, 490 260
             C 525 230, 560 225, 590 245 Z"
          fill="url(#topSweepGrad)"
        />

        {/* Realistic 3D Upper Sweeping Body with Precision Beziers matching original */}
        <path
          d="M 585 240
             C 645 280, 620 345, 545 370
             C 460 400, 430 460, 450 540
             C 470 620, 535 665, 515 720
             C 495 775, 440 780, 385 750
             C 380 710, 430 670, 450 630
             C 410 590, 330 540, 330 440
             C 330 310, 450 220, 585 240 Z"
          fill="url(#topSweepGrad)"
          filter="url(#ribbonShadow)"
        />

        {/* PART 3: Lower Front Ribbon (The glowing pink and magenta voluptuous twist) */}
        <path
          d="M 545 370
             C 505 400, 500 445, 520 500
             C 555 580, 675 510, 665 670
             C 655 770, 560 840, 460 820
             C 390 805, 360 740, 395 675
             C 415 640, 445 630, 460 670
             C 485 735, 545 770, 595 725
             C 635 690, 625 615, 560 570
             C 500 530, 480 470, 495 420
             C 515 350, 585 300, 545 370 Z"
          fill="url(#bottomSweepGrad)"
        />

        {/* Overlapping Fold Ambient Shadow (defines the ribbon intertwine) */}
        <path
          d="M 465 420
             C 475 460, 495 500, 530 535
             C 515 545, 490 520, 480 480
             C 470 445, 465 425, 465 420 Z"
          fill="#0c021f"
          opacity="0.8"
        />

        {/* Smooth Satin Highlight along the upper spine */}
        <path
          d="M 570 250
             C 490 235, 395 305, 355 410
             C 330 480, 345 545, 385 605"
          fill="none"
          stroke="url(#frontHighlightGrad)"
          strokeWidth="18"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Smooth Satin Highlight along the lower magenta loop */}
        <path
          d="M 525 505
             C 560 580, 650 560, 645 680
             C 640 755, 560 810, 470 800
             C 410 790, 380 735, 400 685"
          fill="none"
          stroke="#ffffff"
          strokeWidth="10"
          strokeLinecap="round"
          opacity="0.25"
        />

        {/* Top End Cap 3D Rounded Shading */}
        <ellipse
          cx="580"
          cy="260"
          rx="32"
          ry="20"
          transform="rotate(-25 580 260)"
          fill="url(#capSheen)"
        />

        {/* Bottom End Cap 3D Glow Sheen */}
        <circle
          cx="410"
          cy="705"
          r="16"
          fill="#ffffff"
          opacity="0.25"
        />
      </g>
    </svg>
  );
};
