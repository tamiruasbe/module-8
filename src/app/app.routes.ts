import { Routes } from '@angular/router';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: 'courses/edit/:id',

    loadComponent: () => import('./features/course-edit/course-edit').then((m) => m.CourseEdit),

    canActivate: [roleGuard('Admin', 'Instructor')],
  },
  {
    path: 'dashboard',
    redirectTo: 'login',
    pathMatch: 'full',
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
  {
    path: 'enrollments',
    loadComponent: () =>
      import('./features/enrollment-list/enrollment-list').then((m) => m.EnrollmentList),
  },

  {
    path: 'student-dashboard',
    loadComponent: () =>
      import('./features/student-dashboard/student-dashboard').then((m) => m.StudentDashboard),
  },
  {
    path: 'instructor-dashboard',

    loadComponent: () =>
      import('./features/instructor-dashboard/instructor-dashboard').then(
        (m) => m.InstructorDashboard,
      ),
  },

  {
    path: 'grade-submission',
    loadComponent: () =>
      import('./features/grade-submission/grade-submission.component').then(
        (m) => m.GradeSubmissionComponent,
      ),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register').then((m) => m.Register),
  },
  {
    path: 'admin/courses/new',

    loadComponent: () =>
      import('./features/course-create/course-create').then((m) => m.CourseCreate),

    canActivate: [roleGuard('Admin')],
  },
  {
    path: 'admin/courses',

    loadComponent: () =>
      import('./features/admin-course-list/admin-course-list').then((m) => m.AdminCourseList),

    // canActivate: [roleGuard('Admin')],
    canActivate: [roleGuard('Admin', 'Instructor')],
  },
  {
    path: 'admin/assign-instructor',

    loadComponent: () =>
      import('./features/assign-instructor/assign-instructor').then((m) => m.AssignInstructor),

    canActivate: [roleGuard('Admin')],
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('./features/unauthorized/unauthorized').then((m) => m.Unauthorized),
  },
  {
    path: 'instructor/courses',
    loadComponent: () =>
      import('./features/instructor-course-list/instructor-course-list').then(
        (m) => m.InstructorCourseList,
      ),
  },
  {
    path: '',
    // redirectTo: 'dashboard',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
