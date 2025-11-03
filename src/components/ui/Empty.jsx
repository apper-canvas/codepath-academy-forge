import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ type = "courses" }) => {
  const navigate = useNavigate();

  const getEmptyConfig = () => {
    switch (type) {
      case "courses":
        return {
          icon: "BookOpen",
          title: "No Courses Found",
          description: "Start your programming journey by exploring our available courses.",
          action: {
            label: "Browse All Courses",
            onClick: () => navigate("/"),
          },
        };
      case "bookmarks":
        return {
          icon: "Bookmark",
          title: "No Bookmarks Yet",
          description: "Save lessons you want to revisit by clicking the bookmark icon.",
          action: {
            label: "Explore Lessons",
            onClick: () => navigate("/"),
          },
        };
      case "progress":
        return {
          icon: "TrendingUp",
          title: "No Progress Data",
          description: "Complete some lessons and quizzes to see your learning progress.",
          action: {
            label: "Start Learning",
            onClick: () => navigate("/"),
          },
        };
      case "search":
        return {
          icon: "Search",
          title: "No Results Found",
          description: "Try adjusting your search terms or browse all available courses.",
          action: {
            label: "Clear Search",
            onClick: () => window.location.reload(),
          },
        };
      default:
        return {
          icon: "Layers",
          title: "Nothing Here Yet",
          description: "This section is empty right now.",
          action: {
            label: "Get Started",
            onClick: () => navigate("/"),
          },
        };
    }
  };

  const config = getEmptyConfig();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center"
    >
      <div className="bg-gradient-to-br from-primary/20 to-secondary/20 p-8 rounded-2xl mb-6">
        <ApperIcon 
          name={config.icon} 
          size={64} 
          className="text-primary"
        />
      </div>
      
      <h2 className="text-2xl font-display font-semibold text-white mb-3">
        {config.title}
      </h2>
      
      <p className="text-gray-400 mb-8 max-w-md leading-relaxed">
        {config.description}
      </p>
      
      <Button 
        onClick={config.action.onClick}
        variant="primary"
        size="lg"
        className="flex items-center gap-2 shadow-glow"
      >
        <ApperIcon name="ArrowRight" size={18} />
        {config.action.label}
      </Button>
    </motion.div>
  );
};

export default Empty;