import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Password visibility
  hidePassword = signal(true);

  email = '';
  password = '';

  loading = signal(false);
  errorMessage = signal('');

  clickPassword(event: MouseEvent) {
    this.hidePassword.set(!this.hidePassword());
    event.stopPropagation();
  }

  async login() {
    this.loading.set(true);
    this.errorMessage.set('');

    try {
      await this.authService.login({
        email: this.email,
        password: this.password,
      });

      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      this.errorMessage.set(
        error?.error?.detail || 'Login failed. Please check your email and password.',
      );
    } finally {
      this.loading.set(false);
    }
  }
}
