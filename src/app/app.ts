// import { Component, signal } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
// import { DashboardSummary } from './features/dashboard-summary/dashboard-summary';
// import { EnrollmentList } from './features/enrollment-list/enrollment-list';

// @Component({
//   selector: 'app-root',
//   imports: [RouterOutlet, DashboardSummary, EnrollmentList],
//   templateUrl: './app.html',
//   styleUrl: './app.scss',
// })
// export class App {
//   protected readonly title = signal('tms-client');
// }
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardSummary } from './features/dashboard-summary/dashboard-summary';
import { EnrollmentList } from './features/enrollment-list/enrollment-list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DashboardSummary, EnrollmentList],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('tms-client');
}
