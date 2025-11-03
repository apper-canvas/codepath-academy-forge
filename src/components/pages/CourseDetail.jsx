import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ProgressRing from "@/components/atoms/ProgressRing";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { courseService } from "@/services/api/courseService";
import { userProgressService } from "@/services/api/userProgressService";

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [courseData, progressData] = await Promise.all([
        courseService.getById(parseInt(courseId)),
        userProgressService.getProgress(parseInt(courseId))
      ]);
      
      setCourse(courseData);
      setProgress(progressData || { completedLessons: [], quizScores: {} });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [courseId]);

  const getDifficultyVariant = (difficulty) => {
    const variants = {
      "Beginner": "beginner",
      "Intermediate": "intermediate", 
      "Advanced": "advanced",
    };
    return variants[difficulty] || "default";
  };

const getOverallProgress = () => {
    if (!course || !progress) return 0;
    return course.totalLessons > 0 ? Math.round((progress.completedLessons.length / course.totalLessons) * 100) : 0;
  };

  const isCompleted = getOverallProgress() === 100;
  const hasCompletionDate = progress?.completionDate;

  const handleGenerateCertificate = async () => {
    try {
      const { certificateService } = await import("@/services/api/certificateService");
      await certificateService.generate({
        courseId: parseInt(courseId),
        completionDate: progress.completionDate || new Date().toISOString()
      });
      toast.success("Certificate generated successfully!");
    } catch (err) {
      toast.error("Failed to generate certificate");
    }
  };

  const handleStartLesson = (moduleId, lessonId) => {
    navigate(`/lesson/${courseId}/${moduleId}/${lessonId}`);
  };

  const handleStartQuiz = (moduleId) => {
    navigate(`/quiz/${courseId}/${moduleId}`);
  };

  const isLessonCompleted = (lessonId) => {
    return progress.completedLessons.includes(lessonId);
  };

  const getModuleProgress = (module) => {
    const completedLessons = module.lessons.filter(lesson => 
      progress.completedLessons.includes(lesson.Id)
    ).length;
    return module.lessons.length > 0 ? Math.round((completedLessons / module.lessons.length) * 100) : 0;
  };

  if (loading) return <Loading type="lesson" />;
  if (error) return <Error message={error} onRetry={loadData} type="course" />;
  if (!course) return <Error message="Course not found" type="course" />;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <Button
                onClick={() => navigate("/")}
                variant="ghost"
                size="sm"
                className="p-2"
              >
                <ApperIcon name="ArrowLeft" size={18} />
              </Button>
              <Badge variant={getDifficultyVariant(course.difficulty)} size="sm">
                {course.difficulty}
              </Badge>
              <Badge variant="default" size="sm">
                {course.language}
              </Badge>
              <Badge variant="default" size="sm">
                {course.estimatedHours} hours
              </Badge>
            </div>
            
            <h1 className="text-4xl font-display font-bold text-white mb-4">
              {course.title}
            </h1>
            
            <p className="text-xl text-gray-300 mb-6 leading-relaxed">
              {course.description}
            </p>
          </div>

          <div className="ml-8 flex flex-col items-center">
            <ProgressRing 
              progress={getOverallProgress()} 
              size={100}
              strokeWidth={6}
              showPercentage
              className="mb-4"
            />
            <p className="text-sm text-gray-400 text-center">
              {progress.completedLessons.length} of {course.totalLessons}<br />
              lessons complete
            </p>
          </div>
</div>

        {/* Certificate Section */}
        {isCompleted && hasCompletionDate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
            className="bg-gradient-to-br from-success/10 to-green-600/10 border border-success/30 rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ApperIcon name="Award" size={24} className="text-success" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Course Completed!</h3>
                  <p className="text-sm text-gray-400">
                    Completed on {new Date(progress.completionDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button
                onClick={handleGenerateCertificate}
                variant="success"
                size="sm"
                className="flex items-center gap-2"
              >
                <ApperIcon name="Download" size={16} />
                Get Certificate
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Course Modules */}
      <div className="space-y-6">
        <h2 className="text-2xl font-display font-semibold text-white mb-4">
          Course Modules
        </h2>
        
        {course.modules.map((module, moduleIndex) => (
          <motion.div
            key={module.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: moduleIndex * 0.1 } }}
            className="bg-surface border border-gray-700 rounded-lg overflow-hidden"
          >
            {/* Module Header */}
            <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">{moduleIndex + 1}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-semibold text-white">
                      {module.title}
                    </h3>
                    <p className="text-gray-400">
                      {module.lessons.length} lessons
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <ProgressRing 
                    progress={getModuleProgress(module)} 
                    size={50}
                    strokeWidth={4}
                  />
                  <span className="text-sm text-gray-400">
                    {getModuleProgress(module)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Module Content */}
            <div className="p-6">
              {/* Lessons */}
              <div className="space-y-3 mb-6">
                {module.lessons.map((lesson, lessonIndex) => {
                  const isCompleted = isLessonCompleted(lesson.Id);
                  
                  return (
                    <div
                      key={lesson.Id}
                      className="flex items-center gap-4 p-4 bg-background rounded-lg hover:bg-gray-800 transition-colors cursor-pointer group"
                      onClick={() => handleStartLesson(module.Id, lesson.Id)}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isCompleted 
                          ? "bg-success text-white" 
                          : "bg-gray-600 text-gray-400 group-hover:bg-primary group-hover:text-white"
                      }`}>
                        {isCompleted ? (
                          <ApperIcon name="Check" size={16} />
                        ) : (
                          <span className="text-sm font-medium">{lessonIndex + 1}</span>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white group-hover:text-primary transition-colors">
                          {lesson.title}
                        </h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-sm text-gray-400">
                            {lesson.duration} min
                          </span>
                          {isCompleted && (
                            <Badge variant="success" size="sm">Completed</Badge>
                          )}
                        </div>
                      </div>
                      
                      <ApperIcon 
                        name="ChevronRight" 
                        size={20} 
                        className="text-gray-500 group-hover:text-primary transition-colors" 
                      />
                    </div>
                  );
                })}
              </div>

              {/* Module Quiz */}
              <div className="pt-4 border-t border-gray-700">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-secondary/10 to-primary/10 border border-secondary/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-secondary to-primary rounded-full flex items-center justify-center">
                      <ApperIcon name="Target" size={16} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Module Quiz</h4>
                      <p className="text-sm text-gray-400">
                        Test your knowledge of this module
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handleStartQuiz(module.Id)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <ApperIcon name="Play" size={16} />
                    Start Quiz
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CourseDetail;