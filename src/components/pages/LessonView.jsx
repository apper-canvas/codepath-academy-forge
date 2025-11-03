import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import LessonViewer from "@/components/organisms/LessonViewer";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { courseService } from "@/services/api/courseService";
import { lessonService } from "@/services/api/lessonService";
import { userProgressService } from "@/services/api/userProgressService";

const LessonView = () => {
  const { courseId, moduleId, lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [lessonData, courseData, progressData] = await Promise.all([
        lessonService.getById(parseInt(lessonId)),
        courseService.getById(parseInt(courseId)),
        userProgressService.getProgress(parseInt(courseId))
      ]);
      
      setLesson(lessonData);
      setCourse(courseData);
      setProgress(progressData || { completedLessons: [], bookmarks: [] });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [courseId, moduleId, lessonId]);

  const handleCompleteLesson = async (lessonIdToComplete) => {
    try {
      await userProgressService.markLessonComplete(parseInt(courseId), lessonIdToComplete);
      setProgress(prev => ({
        ...prev,
        completedLessons: [...prev.completedLessons, lessonIdToComplete]
      }));
      toast.success("Lesson completed!");
    } catch (err) {
      toast.error("Failed to mark lesson as complete");
    }
  };

  const handleBookmarkLesson = async (lessonIdToBookmark) => {
    try {
      const bookmarkData = {
        courseId: parseInt(courseId),
        moduleId: parseInt(moduleId),
        lessonId: lessonIdToBookmark,
        title: lesson.title,
        courseTitle: course.title
      };
      
      await userProgressService.toggleBookmark(bookmarkData);
      
      const isCurrentlyBookmarked = progress.bookmarks.some(b => b.lessonId === lessonIdToBookmark);
      
      setProgress(prev => ({
        ...prev,
        bookmarks: isCurrentlyBookmarked 
          ? prev.bookmarks.filter(b => b.lessonId !== lessonIdToBookmark)
          : [...prev.bookmarks, bookmarkData]
      }));
      
      toast.success(isCurrentlyBookmarked ? "Bookmark removed" : "Lesson bookmarked!");
    } catch (err) {
      toast.error("Failed to bookmark lesson");
    }
};

  const isCompleted = progress.completedLessons?.includes(parseInt(lessonId)) ?? false;
  const isBookmarked = progress.bookmarks?.some(b => b.lessonId === parseInt(lessonId)) ?? false;

  if (loading) return <Loading type="lesson" />;
  if (error) return <Error message={error} onRetry={loadData} type="lesson" />;
  if (!lesson) return <Error message="Lesson not found" type="lesson" />;

  return (
    <LessonViewer
      lesson={lesson}
      course={course}
      onComplete={handleCompleteLesson}
      isCompleted={isCompleted}
      onBookmark={handleBookmarkLesson}
      isBookmarked={isBookmarked}
    />
  );
};

export default LessonView;