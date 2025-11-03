import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { userProgressService } from "@/services/api/userProgressService";

const BookmarksPage = () => {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const bookmarksData = await userProgressService.getBookmarks();
      setBookmarks(bookmarksData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRemoveBookmark = async (bookmark) => {
    try {
      await userProgressService.toggleBookmark(bookmark);
      setBookmarks(prev => prev.filter(b => b.lessonId !== bookmark.lessonId));
    } catch (err) {
      console.error("Failed to remove bookmark:", err);
    }
  };

  const handleOpenLesson = (bookmark) => {
    navigate(`/lesson/${bookmark.courseId}/${bookmark.moduleId}/${bookmark.lessonId}`);
  };

  const groupBookmarksByCourse = () => {
    const grouped = {};
    bookmarks.forEach(bookmark => {
      const courseTitle = bookmark.courseTitle;
      if (!grouped[courseTitle]) {
        grouped[courseTitle] = [];
      }
      grouped[courseTitle].push(bookmark);
    });
    return grouped;
  };

  if (loading) return <Loading type="courses" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const groupedBookmarks = groupBookmarksByCourse();
  const courseNames = Object.keys(groupedBookmarks);

  if (bookmarks.length === 0) {
    return <Empty type="bookmarks" />;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">
              Bookmarked Lessons
            </h1>
            <p className="text-gray-400 text-lg">
              Quick access to your saved lessons and important content
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="primary" size="lg">
              {bookmarks.length} saved
            </Badge>
          </div>
        </div>
      </motion.div>

      {/* Bookmarks by Course */}
      <div className="space-y-8">
        {courseNames.map((courseTitle, courseIndex) => (
          <motion.div
            key={courseTitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: courseIndex * 0.1 } }}
            className="bg-surface border border-gray-700 rounded-lg overflow-hidden"
          >
            {/* Course Header */}
            <div className="p-6 bg-gradient-to-r from-gray-800 to-gray-700 border-b border-gray-700">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <ApperIcon name="BookOpen" size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-display font-semibold text-white">
                    {courseTitle}
                  </h2>
                  <p className="text-gray-400">
                    {groupedBookmarks[courseTitle].length} bookmarked lessons
                  </p>
                </div>
              </div>
            </div>

            {/* Bookmarked Lessons */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence>
                  {groupedBookmarks[courseTitle].map((bookmark, index) => (
                    <motion.div
                      key={bookmark.lessonId}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-background border border-gray-700 rounded-lg p-4 hover:border-primary/50 transition-all duration-200 group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <ApperIcon 
                            name="FileText" 
                            size={16} 
                            className="text-primary flex-shrink-0" 
                          />
                          <h3 className="font-medium text-white group-hover:text-primary transition-colors line-clamp-2">
                            {bookmark.title}
                          </h3>
                        </div>
                        
                        <button
                          onClick={() => handleRemoveBookmark(bookmark)}
                          className="text-gray-500 hover:text-error transition-colors p-1"
                          title="Remove bookmark"
                        >
                          <ApperIcon name="BookmarkMinus" size={16} />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant="default" size="sm">
                          Lesson {bookmark.lessonId}
                        </Badge>
                      </div>
                      
                      <Button
                        onClick={() => handleOpenLesson(bookmark)}
                        variant="outline"
                        size="sm"
                        className="w-full flex items-center gap-2"
                      >
                        <ApperIcon name="Play" size={14} />
                        Continue Reading
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BookmarksPage;