import { Component, OnInit, inject, signal } from '@angular/core';

import { RouterOutlet, RouterModule } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';

import { MatButtonModule } from '@angular/material/button';

import { EnrollmentStore } from './store/enrollment.store';

import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',

  standalone: true,

  imports: [RouterOutlet, RouterModule, MatToolbarModule, MatButtonModule],

  templateUrl: './app.html',

  styleUrls: ['./app.scss'],
})
export class App implements OnInit {
  protected readonly title = signal('tms-client');

  private store = inject(EnrollmentStore);

  readonly auth = inject(AuthService);

  ngOnInit(): void {
    // Only load enrollment data when needed
    if (this.auth.isLoggedIn()) {
      this.store.loadEnrollments();
      this.store.listenForLiveUpdates();
    }
  }

  logout(): void {
    this.auth.logout();

    // Navigate to login
    window.location.href = '/login';
  }
}
