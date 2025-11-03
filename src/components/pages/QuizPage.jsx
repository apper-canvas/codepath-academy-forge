import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import QuizInterface from "@/components/organisms/QuizInterface";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { quizService } from "@/services/api/quizService";
import { userProgressService } from "@/services/api/userProgressService";

const QuizPage = () => {
  const { courseId, moduleId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const quizData = await quizService.getByModuleId(parseInt(moduleId));
      setQuiz(quizData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [moduleId]);

  const handleCompleteQuiz = async (quizId, score) => {
    try {
      await userProgressService.recordQuizScore(parseInt(courseId), quizId, score);
      toast.success(`Quiz completed with ${score}% score!`);
    } catch (err) {
      toast.error("Failed to save quiz score");
    }
  };

  const handleRetryQuiz = () => {
    // Quiz component handles retry internally
    toast.info("Quiz reset. Good luck!");
  };

  if (loading) return <Loading type="quiz" />;
  if (error) return <Error message={error} onRetry={loadData} type="quiz" />;
  if (!quiz) return <Error message="Quiz not found" type="quiz" />;

  return (
    <QuizInterface
      quiz={quiz}
      onComplete={handleCompleteQuiz}
      onRetry={handleRetryQuiz}
    />
  );
};

export default QuizPage;