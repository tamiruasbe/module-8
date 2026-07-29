import { Routes } from '@angular/router';
export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/student-dashboard/student-dashboard').then((m) => m.StudentDashboard),
  },
  {
    path: 'courses/:id',
    loadComponent: () =>
      import('./features/course-detail/course-detail').then((m) => m.CourseDetail),
  },
  {
    path: 'enroll',
    loadComponent: () =>
      import('./features/enrollment-form/enrollment-form').then((m) => m.EnrollmentForm),
  },

  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];
