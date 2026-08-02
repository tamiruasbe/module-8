import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { DashboardSummary } from './features/dashboard-summary/dashboard-summary';
import { EnrollmentList } from './features/enrollment-list/enrollment-list';
import { DashboardSummary } from './features/dashboard-summary/dashboard-summary';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('tms-client');
}
