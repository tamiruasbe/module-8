import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CourseStore } from '../../store/course.store';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'tms-admin-course-list',
  standalone: true,
  templateUrl: './admin-course-list.html',
  styleUrl: './admin-course-list.scss',
})
export class AdminCourseList implements OnInit {
  readonly store = inject(CourseStore);
  readonly auth = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);
  private router = inject(Router);

  // The course whose error message should currently be displayed
  readonly deleteErrorCourseId = signal<number | null>(null);

  // Error message to display
  readonly deleteErrorMessage = signal('');

  // Success message
  readonly deleteSuccessCourseId = signal<number | null>(null);
  readonly deleteSuccessMessage = signal('');

  ngOnInit(): void {
    this.store.loadCourses();
  }

  deleteCourse(id: number): void {
    // Clear previous messages
    this.deleteErrorCourseId.set(null);
    this.deleteErrorMessage.set('');
    this.deleteSuccessCourseId.set(null);
    this.deleteSuccessMessage.set('');

    this.store.deleteCourse(id).subscribe({
      next: () => {
        this.snackBar.open('Course deleted successfully.', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['center-snackbar'],
        });
      },

      error: (error) => {
        console.log('DELETE ERROR:', error);
        console.log('ERROR BODY:', error?.error);

        const message =
          error?.error?.detail ??
          error?.error?.message ??
          error?.error?.title ??
          error?.message ??
          'Cannot delete course because active student enrollments exist.';

        this.snackBar.open(message, 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['center-snackbar', 'error-snackbar'],
        });
      },
    });
  }

  editCourse(id: number): void {
    this.router.navigate(['/courses/edit', id]);
  }
  addCourse(): void {
    this.router.navigate(['/admin/courses/new']);
  }

  assignInstructorPage(): void {
    this.router.navigate(['/admin/assign-instructor']);
  }
}
