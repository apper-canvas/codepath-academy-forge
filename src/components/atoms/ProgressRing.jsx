import React from "react";
import { cn } from "@/utils/cn";

const ProgressRing = ({ 
  progress = 0, 
  size = 60, 
  strokeWidth = 4,
  className,
  showPercentage = false,
  children
}) => {
  const normalizedRadius = (size / 2) - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        height={size}
        width={size}
        className="progress-ring transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          stroke="currentColor"
          className="text-gray-700"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress circle */}
        <circle
          stroke="url(#gradient)"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={size / 2}
          cy={size / 2}
          className="transition-all duration-500 ease-out"
        />
        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children || (showPercentage && (
          <span className="text-xs font-semibold text-white">
            {Math.round(progress)}%
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProgressRing;