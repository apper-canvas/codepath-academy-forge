import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format, subDays } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import ProgressRing from "@/components/atoms/ProgressRing";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { courseService } from "@/services/api/courseService";
import { userProgressService } from "@/services/api/userProgressService";

const ProgressDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    totalLessons: 0,
    completedLessons: 0,
    averageScore: 0,
    streak: 0,
  });

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
      calculateStats(coursesData, progressData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (coursesData, progressData) => {
    let totalLessons = 0;
    let completedLessons = 0;
    let completedCourses = 0;
    let totalScore = 0;
    let quizCount = 0;

    coursesData.forEach(course => {
      totalLessons += course.totalLessons;
      
      const courseProgress = progressData[course.Id];
      if (courseProgress) {
        completedLessons += courseProgress.completedLessons.length;
        
        // Check if course is completed
        if (courseProgress.completedLessons.length === course.totalLessons) {
          completedCourses++;
        }
        
        // Calculate quiz scores
        Object.values(courseProgress.quizScores).forEach(score => {
          totalScore += score;
          quizCount++;
        });
      }
    });

    setStats({
      totalCourses: coursesData.length,
      completedCourses,
      totalLessons,
      completedLessons,
      averageScore: quizCount > 0 ? Math.round(totalScore / quizCount) : 0,
      streak: 7, // Mock streak data
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const getCourseProgress = (course) => {
    const courseProgress = progress[course.Id];
    if (!courseProgress) return { percentage: 0, completed: 0, total: course.totalLessons };
    
    const completed = courseProgress.completedLessons.length;
    const percentage = course.totalLessons > 0 ? Math.round((completed / course.totalLessons) * 100) : 0;
    
    return { percentage, completed, total: course.totalLessons };
  };

  const getRecentActivity = () => {
    // Mock recent activity data
    return [
      { date: new Date(), activity: "Completed 'JavaScript Basics' lesson", type: "lesson" },
      { date: subDays(new Date(), 1), activity: "Scored 85% on Python Quiz", type: "quiz" },
      { date: subDays(new Date(), 2), activity: "Started HTML/CSS course", type: "course" },
      { date: subDays(new Date(), 3), activity: "Completed 'Variables and Data Types' lesson", type: "lesson" },
      { date: subDays(new Date(), 4), activity: "Scored 92% on JavaScript Quiz", type: "quiz" },
    ].slice(0, 5);
  };

  if (loading) return <Loading type="courses" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const hasProgress = Object.keys(progress).length > 0;

  if (!hasProgress) {
    return <Empty type="progress" />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-white mb-2">
          Learning Progress
        </h1>
        <p className="text-gray-400 text-lg">
          Track your achievements and continue your programming journey
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <ApperIcon name="BookOpen" size={24} className="text-primary" />
            <Badge variant="primary" size="sm">Courses</Badge>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-white">
              {stats.completedCourses}/{stats.totalCourses}
            </div>
            <div className="text-sm text-gray-400">Completed</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
          className="bg-gradient-to-br from-success/20 to-green-600/20 border border-success/30 rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <ApperIcon name="FileText" size={24} className="text-success" />
            <Badge variant="success" size="sm">Lessons</Badge>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-white">
              {stats.completedLessons}/{stats.totalLessons}
            </div>
            <div className="text-sm text-gray-400">Completed</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
          className="bg-gradient-to-br from-warning/20 to-yellow-600/20 border border-warning/30 rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <ApperIcon name="Target" size={24} className="text-warning" />
            <Badge variant="warning" size="sm">Quiz Score</Badge>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-white">
              {stats.averageScore}%
            </div>
            <div className="text-sm text-gray-400">Average</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
          className="bg-gradient-to-br from-info/20 to-blue-600/20 border border-info/30 rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <ApperIcon name="Flame" size={24} className="text-info" />
            <Badge variant="default" size="sm">Streak</Badge>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-white">
              {stats.streak}
            </div>
            <div className="text-sm text-gray-400">Days</div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Course Progress */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-surface border border-gray-700 rounded-lg p-6"
        >
          <h2 className="text-xl font-display font-semibold text-white mb-6 flex items-center gap-2">
            <ApperIcon name="TrendingUp" size={20} className="text-primary" />
            Course Progress
          </h2>
          
          <div className="space-y-4">
            {courses.slice(0, 5).map((course) => {
              const courseProgress = getCourseProgress(course);
              
              return (
                <div key={course.Id} className="flex items-center gap-4 p-4 bg-background rounded-lg">
                  <ProgressRing 
                    progress={courseProgress.percentage} 
                    size={50}
                    strokeWidth={3}
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white truncate">{course.title}</h3>
                    <p className="text-sm text-gray-400">
                      {courseProgress.completed}/{courseProgress.total} lessons
                    </p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="default" size="sm">{course.language}</Badge>
                      <Badge variant={course.difficulty === "Beginner" ? "beginner" : course.difficulty === "Intermediate" ? "intermediate" : "advanced"} size="sm">
                        {course.difficulty}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-semibold text-primary">
                      {courseProgress.percentage}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-surface border border-gray-700 rounded-lg p-6"
        >
          <h2 className="text-xl font-display font-semibold text-white mb-6 flex items-center gap-2">
            <ApperIcon name="Activity" size={20} className="text-secondary" />
            Recent Activity
          </h2>
          
          <div className="space-y-4">
            {getRecentActivity().map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0, transition: { delay: index * 0.1 } }}
                className="flex items-start gap-3 p-3 bg-background rounded-lg"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  activity.type === "lesson" ? "bg-primary/20" :
                  activity.type === "quiz" ? "bg-success/20" :
                  "bg-secondary/20"
                }`}>
                  <ApperIcon
                    name={
                      activity.type === "lesson" ? "FileText" :
                      activity.type === "quiz" ? "Target" :
                      "BookOpen"
                    }
                    size={16}
                    className={
                      activity.type === "lesson" ? "text-primary" :
                      activity.type === "quiz" ? "text-success" :
                      "text-secondary"
                    }
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">{activity.activity}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {format(activity.date, "MMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProgressDashboard;