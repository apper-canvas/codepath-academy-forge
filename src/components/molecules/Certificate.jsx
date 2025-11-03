import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

const Certificate = ({ certificate, className = "" }) => {
  const completionDate = new Date(certificate.completionDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const getDifficultyVariant = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'error';
      default: return 'secondary';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-gradient-to-br from-surface via-gray-800 to-surface border-2 border-primary/30 rounded-xl p-8 text-center relative overflow-hidden ${className}`}
    >
      {/* Decorative Border */}
      <div className="absolute inset-4 border-2 border-secondary/20 rounded-lg pointer-events-none" />
      
      {/* Header */}
      <div className="relative z-10 mb-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <ApperIcon name="Award" size={32} className="text-primary" />
          <h1 className="text-2xl font-display font-bold text-primary">
            CodePath Academy
          </h1>
        </div>
        
        <h2 className="text-4xl font-display font-bold text-white mb-2">
          Certificate of Completion
        </h2>
        
        <p className="text-gray-400 text-lg">
          This certifies that
        </p>
      </div>

      {/* Recipient */}
      <div className="mb-6">
        <p className="text-gray-400 mb-2">is hereby awarded to</p>
        <div className="text-3xl font-display font-semibold text-white border-b-2 border-primary inline-block pb-2 mb-4">
          Student
        </div>
      </div>

      {/* Course Information */}
      <div className="mb-6">
        <h3 className="text-2xl font-display font-semibold text-success mb-3">
          {certificate.courseName}
        </h3>
        
        <div className="flex items-center justify-center gap-4 mb-3">
          <Badge variant={getDifficultyVariant(certificate.difficulty)} size="sm">
            {certificate.difficulty || 'Course'}
          </Badge>
          
          {certificate.language && (
            <Badge variant="primary" size="sm">
              {certificate.language}
            </Badge>
          )}
          
          {certificate.duration && (
            <Badge variant="secondary" size="sm">
              {certificate.duration} hours
            </Badge>
          )}
        </div>
        
        <p className="text-gray-300 text-sm leading-relaxed">
          Successfully completed the {certificate.language || 'Programming'} course<br/>
          with a difficulty level of {certificate.difficulty || 'Intermediate'}
          {certificate.duration && ` over ${certificate.duration} hours of learning`}
        </p>
      </div>

      {/* Footer Information */}
      <div className="flex justify-between items-end pt-6 border-t border-gray-700">
        <div className="text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            Completion Date
          </p>
          <p className="text-sm font-semibold text-white">
            {completionDate}
          </p>
        </div>
        
        <div className="text-center">
          <div className="w-32 border-b-2 border-primary mb-2"></div>
          <p className="text-sm font-semibold text-white">
            {certificate.instructor || 'CodePath Academy'}
          </p>
          <p className="text-xs text-gray-400">
            Course Instructor
          </p>
        </div>
        
        <div className="text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            Certificate No.
          </p>
          <p className="text-sm font-semibold text-white">
            {certificate.certificateNumber}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Certificate;