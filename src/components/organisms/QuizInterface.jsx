import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import CodeBlock from "@/components/molecules/CodeBlock";
import ProgressRing from "@/components/atoms/ProgressRing";

const QuizInterface = ({ quiz, onComplete, onRetry }) => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  // Timer effect
  useEffect(() => {
    if (showResults) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showResults]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answerIndex
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    return Math.round((correctAnswers / totalQuestions) * 100);
  };

  const handleSubmitQuiz = () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setShowResults(true);

    if (finalScore >= quiz.passingScore) {
      toast.success(`Quiz passed with ${finalScore}% score!`);
      if (onComplete) {
        onComplete(quiz.Id, finalScore);
      }
    } else {
      toast.error(`Quiz failed. You scored ${finalScore}%. Minimum required: ${quiz.passingScore}%`);
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setScore(0);
    setTimeLeft(600);
    
    if (onRetry) {
      onRetry();
    }
  };

  const getAnswerStatus = (questionIndex, answerIndex) => {
    if (!showResults) return null;
    
    const question = quiz.questions[questionIndex];
    const selectedAnswer = selectedAnswers[questionIndex];
    
    if (answerIndex === question.correctAnswer) {
      return "correct";
    } else if (answerIndex === selectedAnswer && selectedAnswer !== question.correctAnswer) {
      return "incorrect";
    }
    return null;
  };

  const ResultsView = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto p-6"
    >
      <div className="bg-surface border border-gray-700 rounded-lg p-8 text-center">
        <div className="mb-6">
          <ProgressRing 
            progress={score} 
            size={120}
            strokeWidth={6}
            className="mb-4"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{score}%</div>
              <div className="text-sm text-gray-400">Score</div>
            </div>
          </ProgressRing>
          
          <h2 className="text-2xl font-display font-bold text-white mb-2">
            {score >= quiz.passingScore ? "Quiz Passed!" : "Quiz Failed"}
          </h2>
          
          <p className="text-gray-400">
            You answered {quiz.questions.filter((_, index) => selectedAnswers[index] === quiz.questions[index].correctAnswer).length} out of {totalQuestions} questions correctly.
          </p>
          
          {score < quiz.passingScore && (
            <p className="text-warning mt-2">
              Minimum passing score: {quiz.passingScore}%
            </p>
          )}
        </div>

        {/* Question Review */}
        <div className="space-y-4 mb-6 text-left">
          {quiz.questions.map((question, questionIndex) => {
            const selectedAnswer = selectedAnswers[questionIndex];
            const isCorrect = selectedAnswer === question.correctAnswer;
            
            return (
              <div key={questionIndex} className="bg-background rounded-lg p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isCorrect ? "bg-success" : "bg-error"
                  }`}>
                    <ApperIcon 
                      name={isCorrect ? "Check" : "X"} 
                      size={14} 
                      className="text-white"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium mb-2">
                      Question {questionIndex + 1}: {question.text}
                    </p>
                    
                    {question.code && (
                      <CodeBlock 
                        code={question.code}
                        language="javascript"
                        className="mb-3"
                      />
                    )}
                    
                    <div className="space-y-1">
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className={`px-3 py-2 rounded text-sm ${
                            optionIndex === question.correctAnswer
                              ? "bg-success/20 text-success border border-success/30"
                              : optionIndex === selectedAnswer && !isCorrect
                              ? "bg-error/20 text-error border border-error/30"
                              : "text-gray-400"
                          }`}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                    
                    {question.explanation && (
                      <div className="mt-3 p-3 bg-info/10 border border-info/30 rounded text-sm text-gray-300">
                        <strong className="text-info">Explanation:</strong> {question.explanation}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <Button
            onClick={handleRetry}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ApperIcon name="RotateCcw" size={16} />
            Try Again
          </Button>
          
          <Button
            onClick={() => navigate(-1)}
            variant="primary"
            className="flex items-center gap-2"
          >
            <ApperIcon name="ArrowLeft" size={16} />
            Back to Course
          </Button>
        </div>
      </div>
    </motion.div>
  );

  if (showResults) {
    return <ResultsView />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            size="sm"
            className="p-2"
          >
            <ApperIcon name="ArrowLeft" size={18} />
          </Button>
          
          <div>
            <h1 className="text-2xl font-display font-bold text-white">
              Quiz: {quiz.title || "Programming Quiz"}
            </h1>
            <p className="text-gray-400">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <ApperIcon name="Clock" size={16} className="text-warning" />
            <span className={`font-code ${timeLeft < 60 ? "text-error" : "text-gray-300"}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
          
          <ProgressRing progress={progress} size={40} />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="bg-surface border border-gray-700 rounded-lg p-8 mb-6"
        >
          <h2 className="text-xl font-medium text-white mb-6">
            {currentQuestion.text}
          </h2>

          {currentQuestion.code && (
            <div className="mb-6">
              <CodeBlock 
                code={currentQuestion.code}
                language="javascript"
              />
            </div>
          )}

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                  selectedAnswers[currentQuestionIndex] === index
                    ? "border-primary bg-primary/10 text-white"
                    : "border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswers[currentQuestionIndex] === index
                      ? "border-primary bg-primary"
                      : "border-gray-500"
                  }`}>
                    {selectedAnswers[currentQuestionIndex] === index && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ApperIcon name="ChevronLeft" size={16} />
          Previous
        </Button>

        <div className="flex gap-2">
          {quiz.questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-8 h-8 rounded-full text-sm font-medium transition-all duration-200 ${
                index === currentQuestionIndex
                  ? "bg-primary text-white"
                  : selectedAnswers[index] !== undefined
                  ? "bg-success text-white"
                  : "bg-gray-600 text-gray-300 hover:bg-gray-500"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {currentQuestionIndex === totalQuestions - 1 ? (
          <Button
            onClick={handleSubmitQuiz}
            variant="success"
            className="flex items-center gap-2"
            disabled={Object.keys(selectedAnswers).length < totalQuestions}
          >
            <ApperIcon name="CheckCircle" size={16} />
            Submit Quiz
          </Button>
        ) : (
          <Button
            onClick={handleNextQuestion}
            disabled={selectedAnswers[currentQuestionIndex] === undefined}
            variant="primary"
            className="flex items-center gap-2"
          >
            Next
            <ApperIcon name="ChevronRight" size={16} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuizInterface;