import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import CourseCard from "@/components/molecules/CourseCard";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { courseService } from "@/services/api/courseService";
import { userProgressService } from "@/services/api/userProgressService";

const MyLearning = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [coursesData, progressData] = await Promise.all([
        courseService.getAll(),
        userProgressService.getAllProgress()
      ]);
      
      setCourses(coursesData);
      setProgress(progressData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getCourseProgress = (courseId) => {
    const courseProgress = progress[courseId];
    if (!courseProgress) return 0;
    
    const course = courses.find(c => c.Id === courseId);
    if (!course) return 0;
    
    const totalLessons = course.totalLessons;
    const completedLessons = courseProgress.completedLessons.length;
    
    return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  };

  const getInProgressCourses = () => {
    return courses.filter(course => {
      const courseProgress = getCourseProgress(course.Id);
      return courseProgress > 0 && courseProgress < 100;
    });
  };

  const getCompletedCourses = () => {
    return courses.filter(course => getCourseProgress(course.Id) === 100);
  };

  const getRecommendedCourses = () => {
    return courses.filter(course => getCourseProgress(course.Id) === 0).slice(0, 3);
  };

  const handleContinueLearning = () => {
    const inProgressCourses = getInProgressCourses();
    if (inProgressCourses.length > 0) {
      navigate(`/course/${inProgressCourses[0].Id}`);
    } else {
      navigate("/");
    }
  };

  if (loading) return <Loading type="courses" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const inProgressCourses = getInProgressCourses();
  const completedCourses = getCompletedCourses();
  const recommendedCourses = getRecommendedCourses();

  const hasAnyProgress = Object.keys(progress).length > 0;

  if (!hasAnyProgress) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-br from-primary/20 to-secondary/20 p-8 rounded-2xl mb-6 inline-block">
              <ApperIcon name="BookOpen" size={64} className="text-primary" />
            </div>
            <h1 className="text-3xl font-display font-bold text-white mb-4">
              Start Your Learning Journey
            </h1>
            <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
              Explore our programming courses and begin building your skills today.
            </p>
            <Button 
              onClick={() => navigate("/")}
              variant="primary"
              size="lg"
              className="flex items-center gap-2 mx-auto shadow-glow"
            >
              <ApperIcon name="Compass" size={18} />
              Explore Courses
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">
              My Learning
            </h1>
            <p className="text-gray-400 text-lg">
              Continue your programming journey and track your progress
            </p>
          </div>
          
          {inProgressCourses.length > 0 && (
            <Button
              onClick={handleContinueLearning}
              variant="primary"
              size="lg"
              className="flex items-center gap-2 shadow-glow"
            >
              <ApperIcon name="Play" size={18} />
              Continue Learning
            </Button>
          )}
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <div className="bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <ApperIcon name="BookOpen" size={24} className="text-primary" />
            <Badge variant="primary" size="sm">In Progress</Badge>
          </div>
          <div className="text-2xl font-bold text-white">{inProgressCourses.length}</div>
          <div className="text-sm text-gray-400">Active courses</div>
        </div>

        <div className="bg-gradient-to-br from-success/20 to-green-600/20 border border-success/30 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <ApperIcon name="CheckCircle" size={24} className="text-success" />
            <Badge variant="success" size="sm">Completed</Badge>
          </div>
          <div className="text-2xl font-bold text-white">{completedCourses.length}</div>
          <div className="text-sm text-gray-400">Courses finished</div>
        </div>

        <div className="bg-gradient-to-br from-warning/20 to-yellow-600/20 border border-warning/30 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <ApperIcon name="Target" size={24} className="text-warning" />
            <Badge variant="warning" size="sm">Progress</Badge>
          </div>
          <div className="text-2xl font-bold text-white">
            {courses.length > 0 ? Math.round((completedCourses.length / courses.length) * 100) : 0}%
          </div>
          <div className="text-sm text-gray-400">Overall completion</div>
        </div>
      </motion.div>

      {/* In Progress Courses */}
      {inProgressCourses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
        >
          <h2 className="text-2xl font-display font-semibold text-white mb-6 flex items-center gap-2">
            <ApperIcon name="PlayCircle" size={24} className="text-primary" />
            Continue Learning
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inProgressCourses.map((course) => (
              <CourseCard
                key={course.Id}
                course={course}
                progress={getCourseProgress(course.Id)}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Completed Courses */}
      {completedCourses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
        >
          <h2 className="text-2xl font-display font-semibold text-white mb-6 flex items-center gap-2">
            <ApperIcon name="Trophy" size={24} className="text-success" />
            Completed Courses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedCourses.map((course) => (
              <CourseCard
                key={course.Id}
                course={course}
                progress={getCourseProgress(course.Id)}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Recommended Courses */}
      {recommendedCourses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
        >
          <h2 className="text-2xl font-display font-semibold text-white mb-6 flex items-center gap-2">
            <ApperIcon name="Lightbulb" size={24} className="text-secondary" />
            Recommended for You
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedCourses.map((course) => (
              <CourseCard
                key={course.Id}
                course={course}
                progress={getCourseProgress(course.Id)}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MyLearning;