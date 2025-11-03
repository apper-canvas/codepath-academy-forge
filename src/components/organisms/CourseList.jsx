import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CourseCard from "@/components/molecules/CourseCard";
import SearchBar from "@/components/molecules/SearchBar";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { courseService } from "@/services/api/courseService";
import { userProgressService } from "@/services/api/userProgressService";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");

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
      setFilteredCourses(coursesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let filtered = courses;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.language.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by language
    if (selectedLanguage !== "All") {
      filtered = filtered.filter(course => course.language === selectedLanguage);
    }

    // Filter by difficulty
    if (selectedDifficulty !== "All") {
      filtered = filtered.filter(course => course.difficulty === selectedDifficulty);
    }

    setFilteredCourses(filtered);
  }, [courses, searchTerm, selectedLanguage, selectedDifficulty]);

  const languages = ["All", ...new Set(courses.map(course => course.language))];
  const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

  const getCourseProgress = (courseId) => {
    const courseProgress = progress[courseId];
    if (!courseProgress) return 0;
    
    const course = courses.find(c => c.Id === courseId);
    if (!course) return 0;
    
    const totalLessons = course.totalLessons;
    const completedLessons = courseProgress.completedLessons.length;
    
    return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  };

  if (loading) return <Loading type="courses" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold text-white mb-2">
          Discover Programming Courses
        </h2>
        <p className="text-gray-400 text-lg">
          Master new programming languages through interactive lessons and hands-on practice
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <SearchBar
          onSearch={setSearchTerm}
          placeholder="Search courses, languages, or topics..."
        />
        
        <div className="flex gap-3 flex-wrap">
          <div className="flex gap-2 flex-wrap">
            <span className="text-sm text-gray-400 self-center whitespace-nowrap">Language:</span>
            {languages.map(lang => (
              <Badge
                key={lang}
                variant={selectedLanguage === lang ? "primary" : "default"}
                className="cursor-pointer hover:scale-105 transition-transform"
                onClick={() => setSelectedLanguage(lang)}
              >
                {lang}
              </Badge>
            ))}
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <span className="text-sm text-gray-400 self-center whitespace-nowrap">Level:</span>
            {difficulties.map(diff => (
              <Badge
                key={diff}
                variant={selectedDifficulty === diff ? "primary" : "default"}
                className="cursor-pointer hover:scale-105 transition-transform"
                onClick={() => setSelectedDifficulty(diff)}
              >
                {diff}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-400">
          Found <span className="text-white font-medium">{filteredCourses.length}</span> courses
        </p>
      </div>

      {/* Course Grid */}
      <AnimatePresence mode="wait">
        {filteredCourses.length === 0 ? (
          <Empty type="search" />
        ) : (
          <motion.div
            key="courses-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { delay: index * 0.1 }
                }}
              >
                <CourseCard
                  course={course}
                  progress={getCourseProgress(course.Id)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CourseList;