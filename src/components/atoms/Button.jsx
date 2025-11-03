import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-gradient-to-r from-primary to-secondary text-white hover:shadow-glow hover:scale-105 focus:ring-primary",
    outline: "border-2 border-primary text-primary hover:bg-primary/10 hover:shadow-glow focus:ring-primary",
    ghost: "text-gray-300 hover:bg-surface hover:text-white focus:ring-gray-500",
    danger: "bg-gradient-to-r from-error to-red-600 text-white hover:shadow-lg hover:scale-105 focus:ring-error",
    success: "bg-gradient-to-r from-success to-green-600 text-white hover:shadow-lg hover:scale-105 focus:ring-success",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-md",
    md: "px-4 py-2 text-sm rounded-lg",
    lg: "px-6 py-3 text-base rounded-lg",
    xl: "px-8 py-4 text-lg rounded-xl",
  };

  return (
    <button
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
    </button>
  );
});

Button.displayName = "Button";

export default Button;