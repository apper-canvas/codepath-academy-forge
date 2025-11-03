import { courseService } from './courseService';

class UserProgressService {
  constructor() {
    this.storageKey = 'codepath_user_progress';
    this.bookmarksKey = 'codepath_bookmarks';
    this.initializeStorage();
  }

  initializeStorage() {
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify({}));
    }
    if (!localStorage.getItem(this.bookmarksKey)) {
      localStorage.setItem(this.bookmarksKey, JSON.stringify([]));
    }
  }

  // Simulate network delay
  delay(ms = 200) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAllProgress() {
    await this.delay();
    const progress = localStorage.getItem(this.storageKey);
    return progress ? JSON.parse(progress) : {};
  }

  async getProgress(courseId) {
    await this.delay();
    const allProgress = await this.getAllProgress();
return allProgress[courseId] || {
      completedLessons: [],
      quizScores: {},
      bookmarks: [],
      lastAccessed: null,
      startedDate: new Date().toISOString(),
      completionDate: null
    };
  }

  async markLessonComplete(courseId, lessonId) {
    await this.delay();
    const allProgress = await this.getAllProgress();
if (!allProgress[courseId]) {
      allProgress[courseId] = {
        completedLessons: [],
        quizScores: {},
        bookmarks: [],
        lastAccessed: null,
        startedDate: new Date().toISOString(),
        completionDate: null
      };
    }

    if (!allProgress[courseId].completedLessons.includes(lessonId)) {
      allProgress[courseId].completedLessons.push(lessonId);
    }
    
    allProgress[courseId].lastAccessed = {
      lessonId: lessonId,
      timestamp: new Date().toISOString()
    };

    localStorage.setItem(this.storageKey, JSON.stringify(allProgress));
    return allProgress[courseId];
  }

  async recordQuizScore(courseId, quizId, score) {
    await this.delay();
    const allProgress = await this.getAllProgress();
    
    if (!allProgress[courseId]) {
      allProgress[courseId] = {
completedLessons: [],
        quizScores: {},
        bookmarks: [],
        lastAccessed: null,
        startedDate: new Date().toISOString(),
        completionDate: null
      };
    }

    allProgress[courseId].quizScores[quizId] = score;
    
    localStorage.setItem(this.storageKey, JSON.stringify(allProgress));
    return allProgress[courseId];
  }

  async getBookmarks() {
    await this.delay();
    const bookmarks = localStorage.getItem(this.bookmarksKey);
    return bookmarks ? JSON.parse(bookmarks) : [];
  }

  async toggleBookmark(bookmarkData) {
    await this.delay();
    const bookmarks = await this.getBookmarks();
    const existingIndex = bookmarks.findIndex(b => b.lessonId === bookmarkData.lessonId);
    
    if (existingIndex >= 0) {
      bookmarks.splice(existingIndex, 1);
    } else {
      bookmarks.push({
        ...bookmarkData,
        dateAdded: new Date().toISOString()
      });
    }
    
    localStorage.setItem(this.bookmarksKey, JSON.stringify(bookmarks));
    return bookmarks;
  }

  async clearProgress(courseId) {
    await this.delay();
    const allProgress = await this.getAllProgress();
    delete allProgress[courseId];
    localStorage.setItem(this.storageKey, JSON.stringify(allProgress));
    return true;
  }

  async clearAllProgress() {
    await this.delay();
    localStorage.setItem(this.storageKey, JSON.stringify({}));
    localStorage.setItem(this.bookmarksKey, JSON.stringify([]));
    return true;
  }

  async getStats() {
    await this.delay();
    const allProgress = await this.getAllProgress();
    const bookmarks = await this.getBookmarks();
    
    let totalLessonsCompleted = 0;
    let totalQuizzesTaken = 0;
    let totalScore = 0;
    let coursesStarted = Object.keys(allProgress).length;
    
    Object.values(allProgress).forEach(courseProgress => {
      totalLessonsCompleted += courseProgress.completedLessons.length;
      const quizScores = Object.values(courseProgress.quizScores);
      totalQuizzesTaken += quizScores.length;
      totalScore += quizScores.reduce((sum, score) => sum + score, 0);
    });

    return {
      coursesStarted,
      totalLessonsCompleted,
      totalQuizzesTaken,
      averageQuizScore: totalQuizzesTaken > 0 ? Math.round(totalScore / totalQuizzesTaken) : 0,
      bookmarksCount: bookmarks.length
    };
}

  // Check and update course completion
async checkCourseCompletion(courseId) {
    await this.delay();
    
    const progress = await this.getProgress(courseId);
    const course = await courseService.getById(courseId);
    
    if (!course || !progress) return false;
    
    const isCompleted = progress.completedLessons.length >= course.totalLessons;
    
    if (isCompleted && !progress.completionDate) {
      const allProgress = await this.getAllProgress();
      allProgress[courseId].completionDate = new Date().toISOString();
      localStorage.setItem(this.storageKey, JSON.stringify(allProgress));
      
      // Generate certificate
      try {
        const { certificateService } = await import('./certificateService');
        await certificateService.generate({
          courseId,
          completionDate: allProgress[courseId].completionDate
        });
      } catch (error) {
        console.error('Failed to generate certificate:', error);
      }
    }
    
    return isCompleted;
  }
}

export const userProgressService = new UserProgressService();