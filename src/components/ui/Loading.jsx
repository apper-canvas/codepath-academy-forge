import React from "react";
import { motion } from "framer-motion";

const Loading = ({ type = "courses" }) => {
  const renderCourseSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-surface border border-gray-700 rounded-lg p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-gray-600 rounded w-3/4 animate-pulse"></div>
            <div className="h-16 w-16 bg-gray-600 rounded-full animate-pulse"></div>
          </div>
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-gray-600 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-gray-600 rounded w-2/3 animate-pulse"></div>
          </div>
          <div className="flex gap-2 mb-4">
            <div className="h-6 bg-gray-600 rounded-full w-20 animate-pulse"></div>
            <div className="h-6 bg-gray-600 rounded-full w-16 animate-pulse"></div>
          </div>
          <div className="h-10 bg-gray-600 rounded w-full animate-pulse"></div>
        </div>
      ))}
    </div>
  );

  const renderLessonSkeleton = () => (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="h-10 bg-gray-600 rounded w-3/4 animate-pulse mb-8"></div>
      <div className="space-y-4">
        <div className="h-4 bg-gray-600 rounded w-full animate-pulse"></div>
        <div className="h-4 bg-gray-600 rounded w-5/6 animate-pulse"></div>
        <div className="h-4 bg-gray-600 rounded w-4/5 animate-pulse"></div>
      </div>
      <div className="bg-surface border border-gray-700 rounded-lg p-4">
        <div className="space-y-2">
          <div className="h-4 bg-gray-600 rounded w-1/2 animate-pulse"></div>
          <div className="h-4 bg-gray-600 rounded w-2/3 animate-pulse"></div>
          <div className="h-4 bg-gray-600 rounded w-1/3 animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  const renderQuizSkeleton = () => (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-surface border border-gray-700 rounded-lg p-8">
        <div className="h-6 bg-gray-600 rounded w-1/4 animate-pulse mb-6"></div>
        <div className="h-8 bg-gray-600 rounded w-full animate-pulse mb-6"></div>
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-600 rounded animate-pulse"></div>
          ))}
        </div>
        <div className="h-10 bg-gray-600 rounded w-32 animate-pulse mt-6"></div>
      </div>
    </div>
  );

  const skeletonComponents = {
    courses: renderCourseSkeleton,
    lesson: renderLessonSkeleton,
    quiz: renderQuizSkeleton,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full"
    >
      {skeletonComponents[type]()}
    </motion.div>
  );
};

export default Loading;