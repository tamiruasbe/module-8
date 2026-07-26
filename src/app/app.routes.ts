import { Routes } from '@angular/router';
export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/student-dashboard/student-dashboard').then((m) => m.StudentDashboard),
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];
