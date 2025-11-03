import coursesData from "@/services/mockData/courses.json";

class CourseService {
  constructor() {
    this.courses = [...coursesData];
  }

  // Simulate network delay
  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.courses];
  }

  async getById(id) {
    await this.delay();
    const course = this.courses.find(course => course.Id === id);
    if (!course) {
      throw new Error(`Course with id ${id} not found`);
    }
    return { ...course };
  }

  async create(courseData) {
    await this.delay();
    const newId = Math.max(...this.courses.map(c => c.Id), 0) + 1;
    const newCourse = {
      Id: newId,
      ...courseData
    };
    this.courses.push(newCourse);
    return { ...newCourse };
  }

  async update(id, courseData) {
    await this.delay();
    const index = this.courses.findIndex(course => course.Id === id);
    if (index === -1) {
      throw new Error(`Course with id ${id} not found`);
    }
    this.courses[index] = { ...this.courses[index], ...courseData };
    return { ...this.courses[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.courses.findIndex(course => course.Id === id);
    if (index === -1) {
      throw new Error(`Course with id ${id} not found`);
    }
    const deletedCourse = this.courses.splice(index, 1)[0];
    return { ...deletedCourse };
  }

  async getByLanguage(language) {
    await this.delay();
    return this.courses.filter(course => 
      course.language.toLowerCase() === language.toLowerCase()
    );
  }

  async getByDifficulty(difficulty) {
    await this.delay();
    return this.courses.filter(course => 
      course.difficulty.toLowerCase() === difficulty.toLowerCase()
    );
  }
}

export const courseService = new CourseService();