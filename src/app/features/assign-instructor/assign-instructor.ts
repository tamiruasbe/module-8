import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { CourseService } from '../../services/course.service';
import { InstructorService } from '../../services/instructor.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Course } from '../../models/course.model';
import { Instructor } from '../../models/instructor.model';

@Component({
  selector: 'tms-assign-instructor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assign-instructor.html',
  styleUrl: './assign-instructor.scss',
})
export class AssignInstructor implements OnInit {
  private readonly courseService = inject(CourseService);
  private readonly instructorService = inject(InstructorService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  // ============================================================
  // DATA
  // ============================================================

  readonly courses = signal<Course[]>([]);
  readonly instructors = signal<Instructor[]>([]);

  // ============================================================
  // STATE
  // ============================================================

  readonly isLoadingCourses = signal(false);
  readonly isLoadingInstructors = signal(false);

  readonly errorMessage = signal('');
  readonly successMessage = signal('');

  // Currently selected instructor for each course
  readonly selectedInstructor = signal<Record<number, string>>({});

  // Course currently being processed
  readonly assigningCourseId = signal<number | null>(null);

  ngOnInit(): void {
    this.loadCourses();
    this.loadInstructors();
  }

  // ============================================================
  // LOAD COURSES
  // ============================================================

  loadCourses(): void {
    this.isLoadingCourses.set(true);
    this.errorMessage.set('');

    this.courseService.getAll().subscribe({
      next: (courses) => {
        this.courses.set(courses);
        this.isLoadingCourses.set(false);
      },

      error: (error) => {
        console.error('LOAD COURSES ERROR:', error);

        this.errorMessage.set(
          error?.error?.detail ?? error?.error?.message ?? 'Failed to load courses.',
        );

        this.isLoadingCourses.set(false);
      },
    });
  }

  // ============================================================
  // LOAD INSTRUCTORS
  // ============================================================

  loadInstructors(): void {
    this.isLoadingInstructors.set(true);

    this.instructorService.getAll().subscribe({
      next: (instructors) => {
        this.instructors.set(instructors);
        this.isLoadingInstructors.set(false);
      },

      error: (error) => {
        console.error('LOAD INSTRUCTORS ERROR:', error);

        this.errorMessage.set(
          error?.error?.detail ?? error?.error?.message ?? 'Failed to load instructors.',
        );

        this.isLoadingInstructors.set(false);
      },
    });
  }

  // ============================================================
  // SELECT INSTRUCTOR
  // ============================================================

  selectInstructor(courseId: number, instructorId: string): void {
    this.selectedInstructor.update((current) => ({
      ...current,
      [courseId]: instructorId,
    }));

    this.successMessage.set('');
    this.errorMessage.set('');
  }

  // ============================================================
  // ASSIGN INSTRUCTOR
  // ============================================================

  assignInstructor(course: Course): void {
    const instructorId = this.selectedInstructor()[course.id];

    if (!instructorId) {
      this.errorMessage.set('Please select an instructor first.');

      this.successMessage.set('');

      return;
    }

    this.assigningCourseId.set(course.id);

    this.errorMessage.set('');
    this.successMessage.set('');

    this.instructorService.assignInstructor(course.id, instructorId).subscribe({
      next: (response) => {
        console.log('ASSIGN SUCCESS:', response);

        this.assigningCourseId.set(null);

        // this.successMessage.set(`${course.title} assigned successfully.`);
        this.snackBar.open(`${course.title} assigned successfully.`, 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['center-snackbar', 'error-snackbar'],
        });
        // Update local course object
        this.courses.update((courses) =>
          courses.map((c) =>
            c.id === course.id
              ? {
                  ...c,
                  instructorId,
                }
              : c,
          ),
        );
      },

      error: (error) => {
        console.error('ASSIGN INSTRUCTOR ERROR:', error);

        this.assigningCourseId.set(null);

        this.snackBar.open(
          error?.error?.detail ??
            error?.error?.message ??
            error?.error?.title ??
            'Failed to assign instructor.',
          'Close',
          {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['center-snackbar', 'error-snackbar'],
          },
        );
      },
    });
  }

  // ============================================================
  // REMOVE INSTRUCTOR
  // ============================================================

  removeInstructor(course: Course): void {
    this.assigningCourseId.set(course.id);

    this.errorMessage.set('');
    this.successMessage.set('');

    this.instructorService.removeInstructor(course.id).subscribe({
      next: (response) => {
        console.log('REMOVE SUCCESS:', response);

        this.assigningCourseId.set(null);

        this.successMessage.set(`Instructor removed from ${course.title}.`);

        // Remove instructor locally
        this.courses.update((courses) =>
          courses.map((c) =>
            c.id === course.id
              ? {
                  ...c,
                  instructorId: null,
                }
              : c,
          ),
        );

        // Clear selected instructor
        this.selectedInstructor.update((current) => {
          const updated = { ...current };

          delete updated[course.id];

          return updated;
        });
      },

      error: (error) => {
        console.error('REMOVE INSTRUCTOR ERROR:', error);

        this.assigningCourseId.set(null);

        this.errorMessage.set(
          error?.error?.detail ??
            error?.error?.message ??
            error?.error?.title ??
            'Failed to remove instructor.',
        );
      },
    });
  }

  // ============================================================
  // GET INSTRUCTOR NAME
  // ============================================================

  getInstructorName(instructorId: string | null | undefined): string {
    if (!instructorId) {
      return 'Not assigned';
    }

    const instructor = this.instructors().find((i) => i.id === instructorId);

    if (!instructor) {
      return 'Unknown instructor';
    }

    return `${instructor.firstName} ${instructor.lastName}`;
  }

  // ============================================================
  // BACK
  // ============================================================

  backToCourses(): void {
    this.router.navigate(['/admin/courses']);
  }
}
