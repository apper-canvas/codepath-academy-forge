import lessonsData from "@/services/mockData/lessons.json";

class LessonService {
  constructor() {
    this.lessons = [...lessonsData];
  }

  // Simulate network delay
  delay(ms = 250) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.lessons];
  }

  async getById(id) {
    await this.delay();
    const lesson = this.lessons.find(lesson => lesson.Id === id);
    if (!lesson) {
      throw new Error(`Lesson with id ${id} not found`);
    }
    return { ...lesson };
  }

  async getByModuleId(moduleId) {
    await this.delay();
    // In a real app, this would filter by actual module relationships
    // For this demo, we'll return lessons based on ID ranges
    return this.lessons.filter(lesson => {
      // Mock module relationships based on lesson ID ranges
      if (moduleId === 1) return lesson.Id >= 1 && lesson.Id <= 3;
      if (moduleId === 2) return lesson.Id >= 4 && lesson.Id <= 6;
      if (moduleId === 3) return lesson.Id >= 7 && lesson.Id <= 11;
      return false;
    });
  }

  async create(lessonData) {
    await this.delay();
    const newId = Math.max(...this.lessons.map(l => l.Id), 0) + 1;
    const newLesson = {
      Id: newId,
      ...lessonData
    };
    this.lessons.push(newLesson);
    return { ...newLesson };
  }

  async update(id, lessonData) {
    await this.delay();
    const index = this.lessons.findIndex(lesson => lesson.Id === id);
    if (index === -1) {
      throw new Error(`Lesson with id ${id} not found`);
    }
    this.lessons[index] = { ...this.lessons[index], ...lessonData };
    return { ...this.lessons[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.lessons.findIndex(lesson => lesson.Id === id);
    if (index === -1) {
      throw new Error(`Lesson with id ${id} not found`);
    }
    const deletedLesson = this.lessons.splice(index, 1)[0];
    return { ...deletedLesson };
  }
}

export const lessonService = new LessonService();