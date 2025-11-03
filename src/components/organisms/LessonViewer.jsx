import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import CodeBlock from "@/components/molecules/CodeBlock";

const LessonViewer = ({ lesson, course, onComplete, isCompleted, onBookmark, isBookmarked }) => {
  const navigate = useNavigate();

  const handleComplete = () => {
    if (onComplete) {
      onComplete(lesson.Id);
    }
  };

  const handleBookmark = () => {
    if (onBookmark) {
      onBookmark(lesson.Id);
    }
  };

  const formatContent = (content) => {
    // Simple markdown-like parsing for demonstration
    return content
      .split('\n\n')
      .map((paragraph, index) => {
        if (paragraph.startsWith('# ')) {
          return (
            <h1 key={index} className="text-3xl font-display font-bold text-white mb-4">
              {paragraph.replace('# ', '')}
            </h1>
          );
        } else if (paragraph.startsWith('## ')) {
          return (
            <h2 key={index} className="text-2xl font-display font-semibold text-white mb-3">
              {paragraph.replace('## ', '')}
            </h2>
          );
        } else if (paragraph.startsWith('### ')) {
          return (
            <h3 key={index} className="text-xl font-display font-medium text-white mb-2">
              {paragraph.replace('### ', '')}
            </h3>
          );
        } else if (paragraph.startsWith('- ')) {
          const listItems = paragraph.split('\n').filter(line => line.startsWith('- '));
          return (
            <ul key={index} className="list-disc list-inside space-y-1 mb-4 text-gray-300">
              {listItems.map((item, itemIndex) => (
                <li key={itemIndex}>{item.replace('- ', '')}</li>
              ))}
            </ul>
          );
        } else {
          return (
            <p key={index} className="text-gray-300 mb-4 leading-relaxed">
              {paragraph}
            </p>
          );
        }
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <Button
              onClick={() => navigate(-1)}
              variant="ghost"
              size="sm"
              className="p-2"
            >
              <ApperIcon name="ArrowLeft" size={18} />
            </Button>
            <Badge variant="default" size="sm">
              {course?.language}
            </Badge>
            <span className="text-sm text-gray-400">•</span>
            <span className="text-sm text-gray-400">{lesson.duration} min read</span>
          </div>
          
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            {lesson.title}
          </h1>
          
          {isCompleted && (
            <div className="flex items-center gap-2 text-success">
              <ApperIcon name="CheckCircle" size={16} />
              <span className="text-sm font-medium">Completed</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 ml-4">
          <Button
            onClick={handleBookmark}
            variant="ghost"
            size="sm"
            className="p-2"
          >
            <ApperIcon 
              name={isBookmarked ? "BookmarkCheck" : "Bookmark"} 
              size={18}
              className={isBookmarked ? "text-primary" : ""}
            />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="prose prose-invert prose-lg max-w-none mb-8">
        {formatContent(lesson.content)}
      </div>

      {/* Code Examples */}
      {lesson.codeExamples && lesson.codeExamples.length > 0 && (
        <div className="space-y-6 mb-8">
          <h2 className="text-2xl font-display font-semibold text-white mb-4">
            Code Examples
          </h2>
          {lesson.codeExamples.map((example, index) => (
            <div key={index} className="space-y-3">
              {example.explanation && (
                <p className="text-gray-300">{example.explanation}</p>
              )}
              <CodeBlock
                code={example.code}
                language={example.language}
                runnable={example.runnable}
              />
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-8 border-t border-gray-700">
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ApperIcon name="ArrowLeft" size={16} />
          Back to Course
        </Button>

        <Button
          onClick={handleComplete}
          variant={isCompleted ? "success" : "primary"}
          className="flex items-center gap-2"
        >
          {isCompleted ? (
            <>
              <ApperIcon name="CheckCircle" size={16} />
              Completed
            </>
          ) : (
            <>
              <ApperIcon name="Check" size={16} />
              Mark Complete
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default LessonViewer;