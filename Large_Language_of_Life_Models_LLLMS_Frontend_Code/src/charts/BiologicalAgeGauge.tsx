import React from 'react';

interface BiologicalAgeGaugeProps {
  predicted: number;
  chronological: number;
}

const BiologicalAgeGauge: React.FC<BiologicalAgeGaugeProps> = ({ predicted, chronological }) => {
  const size = 200;
  const strokeWidth = 15;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;

  // Map 0-120 years to 0-360 degrees (starting from top)
  const maxAge = 120;
  const predictedProgress = (Math.min(predicted, maxAge) / maxAge) * circumference;
  // chronologicalProgress was unused and has been removed.

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
        {/* Background Track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#F3F4F6"
          strokeWidth={strokeWidth}
        />
        
        {/* Predicted Age Track (Inner) */}
        <circle
          cx={center}
          cy={center}
          r={radius - 2}
          fill="none"
          stroke={predicted > chronological ? "#DC2626" : "#16A34A"}
          strokeWidth={strokeWidth}
          strokeDasharray={`${predictedProgress} ${circumference}`}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />

        {/* Chronological Age Marker (Dot) */}
        <circle
          cx={center + radius * Math.cos((chronological / maxAge) * 2 * Math.PI)}
          cy={center + radius * Math.sin((chronological / maxAge) * 2 * Math.PI)}
          r={5}
          fill="#1F2937"
          className="rotate-[90deg] origin-center"
        />
      </svg>
      
      {/* Center Text */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-black text-slate-900">{predicted.toFixed(1)}</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Predicted</span>
      </div>
    </div>
  );
};

export default BiologicalAgeGauge;
