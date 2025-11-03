import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  className, 
  variant = "default", 
  size = "md",
  children, 
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-full";

  const variants = {
    default: "bg-surface text-gray-300 border border-gray-600",
    primary: "bg-gradient-to-r from-primary to-secondary text-white",
    success: "bg-gradient-to-r from-success to-green-600 text-white",
    warning: "bg-gradient-to-r from-warning to-yellow-600 text-white",
    error: "bg-gradient-to-r from-error to-red-600 text-white",
    beginner: "bg-gradient-to-r from-success to-green-500 text-white",
    intermediate: "bg-gradient-to-r from-warning to-yellow-500 text-white",
    advanced: "bg-gradient-to-r from-error to-red-500 text-white",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  return (
    <span
      ref={ref}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;