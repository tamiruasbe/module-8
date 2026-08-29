import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

import {
  MatCardContent,
  MatCardActions,
  MatCard,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [RouterLink, MatCardContent, MatCardActions, MatCard, MatCardHeader, MatCardTitle],
  templateUrl: './unauthorized.html',
  styleUrl: './unauthorized.scss',
})
export class Unauthorized {
  private auth = inject(AuthService);
  private router = inject(Router);

  goToLogin(): void {
    // Clear the currently logged-in user
    this.auth.logout();

    // Then go to login
    this.router.navigate(['/login']);
  }
}
