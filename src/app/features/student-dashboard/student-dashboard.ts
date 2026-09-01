import { Component, signal, computed, inject } from '@angular/core';

import { CourseCard } from '../../ui/course-card/course-card';
import { Course } from '../../models/course.model';

import { EnrollmentService } from '../../services/enrollment';
import { CourseStore } from '../../store/course.store';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CourseCard],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.scss',
})
export class StudentDashboard {
  // Enrollment API
  private enrollmentApi = inject(EnrollmentService);

  // Course SignalStore
  courseStore = inject(CourseStore);

  studentName = signal('Liya Kebede');

  earnedCredits = signal(45);

  graduationStatus = computed(() =>
    this.earnedCredits() >= 120 ? 'Eligible for Graduation' : 'In Progress',
  );

  selectedCourse = signal<Course | null>(null);

  private testStudentId = 1;

  constructor() {
    // Load courses when dashboard opens
    this.courseStore.loadCourses();
  }

  registerForClass() {
    this.earnedCredits.update((c) => c + 3);
  }

  handleEnroll(course: Course) {
    const studentId = this.testStudentId++;

    this.enrollmentApi.enroll(studentId, course.code).subscribe({
      next: (result) => {
        console.log(`Student ${studentId} enrolled in ${course.code}`, result);

        // Reload courses so enrollment count updates
        this.courseStore.loadCourses();
      },

      error: () => {
        // The global errorInterceptor handles this.
        //
        // Example console output:
        // API Error Response: The course is already full.
      },
    });
  }

  handleDelete(course: Course) {
    this.courseStore.deleteCourse(course.id);
  }
}
