import quizzesData from "@/services/mockData/quizzes.json";

class QuizService {
  constructor() {
    this.quizzes = [...quizzesData];
  }

  // Simulate network delay
  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.quizzes];
  }

  async getById(id) {
    await this.delay();
    const quiz = this.quizzes.find(quiz => quiz.Id === id);
    if (!quiz) {
      throw new Error(`Quiz with id ${id} not found`);
    }
    return { ...quiz };
  }

  async getByCourseId(courseId) {
    await this.delay();
    return this.quizzes.filter(quiz => quiz.courseId === courseId);
  }

  async getByModuleId(moduleId) {
    await this.delay();
    const quiz = this.quizzes.find(quiz => quiz.moduleId === moduleId);
    if (!quiz) {
      throw new Error(`Quiz for module ${moduleId} not found`);
    }
    return { ...quiz };
  }

  async create(quizData) {
    await this.delay();
    const newId = Math.max(...this.quizzes.map(q => q.Id), 0) + 1;
    const newQuiz = {
      Id: newId,
      ...quizData
    };
    this.quizzes.push(newQuiz);
    return { ...newQuiz };
  }

  async update(id, quizData) {
    await this.delay();
    const index = this.quizzes.findIndex(quiz => quiz.Id === id);
    if (index === -1) {
      throw new Error(`Quiz with id ${id} not found`);
    }
    this.quizzes[index] = { ...this.quizzes[index], ...quizData };
    return { ...this.quizzes[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.quizzes.findIndex(quiz => quiz.Id === id);
    if (index === -1) {
      throw new Error(`Quiz with id ${id} not found`);
    }
    const deletedQuiz = this.quizzes.splice(index, 1)[0];
    return { ...deletedQuiz };
  }

  async submitQuizAnswer(quizId, questionId, answer) {
    await this.delay(100);
    const quiz = this.quizzes.find(q => q.Id === quizId);
    if (!quiz) {
      throw new Error(`Quiz with id ${quizId} not found`);
    }
    
    const question = quiz.questions.find(q => q.Id === questionId);
    if (!question) {
      throw new Error(`Question with id ${questionId} not found`);
    }
    
    return {
      correct: answer === question.correctAnswer,
      explanation: question.explanation,
      correctAnswer: question.correctAnswer
    };
  }
}

export const quizService = new QuizService();