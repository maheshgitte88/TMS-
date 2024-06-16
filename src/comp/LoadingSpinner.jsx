import React from 'react';

const LoadingSpinner = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid"
    width="20"
    height="20"
    style={{ shapeRendering: 'auto', display: 'block', background: 'rgb(255, 255, 255)' }}
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <g>
      <circle
        strokeDasharray="164.93361431346415 56.97787143782138"
        r="35"
        strokeWidth="10"
        stroke="#cc1345"
        fill="none"
        cy="50"
        cx="50"
      >
        <animateTransform
          keyTimes="0;1"
          values="0 50 50;360 50 50"
          dur="1s"
          repeatCount="indefinite"
          type="rotate"
          attributeName="transform"
        />
      </circle>
    </g>
  </svg>
);

export default LoadingSpinner;
