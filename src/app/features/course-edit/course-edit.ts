import { Component, effect, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-course-edit',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './course-edit.html',
  styleUrl: './course-edit.scss',
})
export class CourseEdit {
  private courseService = inject(CourseService);
  private router = inject(Router);
  private auth = inject(AuthService);
  // Gets :id from /courses/edit/:id
  id = input.required<string>();

  // Form fields
  code = '';
  title = '';
  maxCapacity = 0;

  enrollmentCount = 0;

  loading = signal(false);
  saving = signal(false);

  errorMessage = signal('');
  successMessage = signal('');

  constructor() {
    // IMPORTANT:
    // Do NOT call this.loadCourse() directly here.
    //
    // Angular needs to provide the route input first.
    effect(() => {
      const courseId = this.id();

      if (courseId) {
        this.loadCourse(courseId);
      }
    });
  }

  // ============================================================
  // LOAD COURSE
  // ============================================================

  private loadCourse(id: string): void {
    const courseId = Number(id);

    if (!Number.isInteger(courseId)) {
      this.errorMessage.set('Invalid course ID.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.courseService.getById(String(courseId)).subscribe({
      next: (course) => {
        this.code = course.code;
        this.title = course.title;
        this.maxCapacity = course.maxCapacity;
        this.enrollmentCount = course.enrollmentCount;

        this.loading.set(false);
      },

      error: (error) => {
        console.error('Failed to load course:', error);

        this.errorMessage.set(
          error?.error?.detail || error?.error?.title || 'Failed to load course.',
        );

        this.loading.set(false);
      },
    });
  }

  private goBackToCourseList(): void {
    if (this.auth.hasRole('Admin')) {
      this.router.navigate(['/admin/courses']);
      return;
    }

    if (this.auth.hasRole('Instructor')) {
      this.router.navigate(['/instructor/courses']);
      return;
    }

    this.router.navigate(['/dashboard']);
  }
  // ============================================================
  // SAVE
  // ============================================================

  save(): void {
    const courseId = Number(this.id());

    if (!Number.isInteger(courseId)) {
      this.errorMessage.set('Invalid course ID.');
      return;
    }

    if (!this.code.trim()) {
      this.errorMessage.set('Course code is required.');
      return;
    }

    if (!this.title.trim()) {
      this.errorMessage.set('Course title is required.');
      return;
    }

    if (this.maxCapacity < this.enrollmentCount) {
      this.errorMessage.set(
        `Maximum capacity cannot be less than the current enrollment count (${this.enrollmentCount}).`,
      );

      return;
    }

    this.saving.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.courseService
      .updateCourse(courseId, {
        id: courseId,
        code: this.code.trim(),
        title: this.title.trim(),
        maxCapacity: this.maxCapacity,
      })
      .subscribe({
        next: () => {
          this.saving.set(false);

          this.successMessage.set('Course updated successfully.');

          setTimeout(() => {
            // this.router.navigate(['/admin/courses']);
            this.goBackToCourseList();
          }, 700);
        },

        error: (error) => {
          console.error('Failed to update course:', error);

          let message = 'Failed to update course.';

          if (error?.status === 403) {
            message = 'You are not authorized to edit this course.';
          } else if (error?.error?.detail) {
            message = error.error.detail;
          } else if (error?.error?.title) {
            message = error.error.title;
          }

          this.errorMessage.set(message);
          this.saving.set(false);

          // Remove the error message after 5 seconds
          setTimeout(() => {
            this.errorMessage.set('');
          }, 5000);
        },
      });
  }

  // ============================================================
  // CANCEL
  // ============================================================

  cancel(): void {
    // this.router.navigate(['/admin/courses']);
    this.goBackToCourseList();
  }
}
