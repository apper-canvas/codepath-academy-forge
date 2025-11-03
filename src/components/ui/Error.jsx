import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ 
  message = "Something went wrong", 
  onRetry,
  type = "general" 
}) => {
  const getErrorConfig = () => {
    switch (type) {
      case "course":
        return {
          icon: "BookX",
          title: "Course Not Found",
          description: "The course you're looking for might have been moved or doesn't exist.",
        };
      case "lesson":
        return {
          icon: "FileX",
          title: "Lesson Unavailable",
          description: "This lesson couldn't be loaded. Please try again.",
        };
      case "quiz":
        return {
          icon: "AlertCircle",
          title: "Quiz Error",
          description: "There was a problem loading the quiz questions.",
        };
      default:
        return {
          icon: "AlertTriangle",
          title: "Something Went Wrong",
          description: "We encountered an unexpected error.",
        };
    }
  };

  const config = getErrorConfig();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center"
    >
      <div className="bg-error/10 p-6 rounded-full mb-6">
        <ApperIcon 
          name={config.icon} 
          size={48} 
          className="text-error"
        />
      </div>
      
      <h2 className="text-2xl font-display font-semibold text-white mb-2">
        {config.title}
      </h2>
      
      <p className="text-gray-400 mb-2 max-w-md">
        {config.description}
      </p>
      
      {message !== "Something went wrong" && (
        <p className="text-sm text-gray-500 mb-6 font-code">
          {message}
        </p>
      )}
      
      <div className="flex gap-3">
        {onRetry && (
          <Button 
            onClick={onRetry}
            variant="primary"
            className="flex items-center gap-2"
          >
            <ApperIcon name="RefreshCw" size={16} />
            Try Again
          </Button>
        )}
        
        <Button 
          onClick={() => window.history.back()}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ApperIcon name="ArrowLeft" size={16} />
          Go Back
        </Button>
      </div>
    </motion.div>
  );
};

export default Error;