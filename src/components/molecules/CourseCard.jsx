import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ProgressRing from "@/components/atoms/ProgressRing";

const CourseCard = ({ course, progress = 0 }) => {
  const navigate = useNavigate();

  const getLanguageIcon = (language) => {
    const icons = {
      "JavaScript": "Code",
      "Python": "FileText",
      "HTML/CSS": "Layout",
      "React": "Component",
      "Node.js": "Server",
    };
    return icons[language] || "Code";
  };

  const getDifficultyVariant = (difficulty) => {
    const variants = {
      "Beginner": "beginner",
      "Intermediate": "intermediate", 
      "Advanced": "advanced",
    };
    return variants[difficulty] || "default";
  };

  const handleStartCourse = () => {
    navigate(`/course/${course.Id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group bg-surface border border-gray-700 rounded-lg p-6 shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer"
      onClick={handleStartCourse}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-display font-semibold text-xl text-white mb-2 group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
            {course.title}
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <ApperIcon 
              name={getLanguageIcon(course.language)} 
              size={16} 
              className="text-primary"
            />
            <span className="text-sm text-gray-400">{course.language}</span>
          </div>
        </div>
        
        <ProgressRing 
          progress={progress} 
          size={56}
          showPercentage={progress > 0}
        />
      </div>

      {/* Description */}
      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
        {course.description}
      </p>

      {/* Badges */}
      <div className="flex items-center gap-2 mb-4">
        <Badge variant={getDifficultyVariant(course.difficulty)} size="sm">
          {course.difficulty}
        </Badge>
        <Badge variant="default" size="sm">
          {course.totalLessons} lessons
        </Badge>
        <Badge variant="default" size="sm">
          {course.estimatedHours}h
        </Badge>
      </div>

      {/* Action */}
      <Button 
        variant={progress > 0 ? "outline" : "primary"} 
        className="w-full"
        onClick={(e) => {
          e.stopPropagation();
          handleStartCourse();
        }}
      >
        {progress > 0 ? (
          <>
            <ApperIcon name="Play" size={16} className="mr-2" />
            Continue
          </>
        ) : (
          <>
            <ApperIcon name="BookOpen" size={16} className="mr-2" />
            Start Course
          </>
        )}
      </Button>
    </motion.div>
  );
};

export default CourseCard;