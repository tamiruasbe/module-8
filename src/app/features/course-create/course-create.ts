import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-course-create',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './course-create.html',
  styleUrl: './course-create.scss',
})
export class CourseCreate {
  private courseService = inject(CourseService);
  private router = inject(Router);

  code = '';
  title = '';
  maxCapacity = 1;

  saving = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  save(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (!this.code.trim()) {
      this.errorMessage.set('Course code is required.');
      return;
    }

    if (!this.title.trim()) {
      this.errorMessage.set('Course title is required.');
      return;
    }

    if (this.maxCapacity < 1) {
      this.errorMessage.set('Maximum capacity must be at least 1.');
      return;
    }

    this.saving.set(true);

    this.courseService
      .createCourse({
        code: this.code.trim(),
        title: this.title.trim(),
        maxCapacity: this.maxCapacity,
      })
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.successMessage.set('Course created successfully.');

          setTimeout(() => {
            this.router.navigate(['/admin/courses']);
          }, 700);
        },

        error: (error) => {
          console.error('Failed to create course:', error);

          if (error?.status === 409) {
            this.errorMessage.set(
              error?.error?.detail ?? 'A course with this code already exists.',
            );
          } else if (error?.error?.detail) {
            this.errorMessage.set(error.error.detail);
          } else if (error?.error?.title) {
            this.errorMessage.set(error.error.title);
          } else {
            this.errorMessage.set('Failed to create course.');
          }

          this.saving.set(false);
        },
      });
  }

  cancel(): void {
    this.router.navigate(['/admin/courses']);
  }
}
