import { Component, inject, OnInit } from '@angular/core';
import { EnrollmentStore } from '../../store/enrollment.store';
import { DashboardSummary } from '../dashboard-summary/dashboard-summary';

@Component({
  selector: 'tms-enrollment-list',
  standalone: true,
  templateUrl: './enrollment-list.html',
  imports: [DashboardSummary],
})
export class EnrollmentList implements OnInit {
  store = inject(EnrollmentStore);

  ngOnInit(): void {
    this.store.loadEnrollments();
  }

  onApprove(id: string): void {
    this.store.approveEnrollment(id);
  }
}
