import React from 'react';

function CircularStepProgress({ stepNumber, totalSteps, size = 52, strokeWidth = 6 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(stepNumber / totalSteps, 1);
  const offset = circumference * (1 - progress);

  return (
    <svg width={size} height={size} style={{ display: 'block' }}>
      {/* Fondo gris claro */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#e6e6e6"
        strokeWidth={strokeWidth}
        fill="none"
      />
      {/* Barra de progreso azul */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#1a73e8"
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      {/* Texto central */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
        fill="#000"
      >
        {`${stepNumber} of ${totalSteps}`}
      </text>
    </svg>
  );
}

export {CircularStepProgress};
