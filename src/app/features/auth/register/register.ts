import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private authService = inject(AuthService);

  // ============================================================
  // PASSWORD VISIBILITY
  // ============================================================

  hidePassword = signal(true);
  hideConfirmPassword = signal(true);

  // ============================================================
  // FORM FIELDS
  // ============================================================

  firstName = '';
  lastName = '';
  email = '';
  password = '';
  confirmPassword = '';
  role = 'Student';

  // ============================================================
  // LOADING / MESSAGES
  // ============================================================

  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  // ============================================================
  // EMAIL VALIDATION
  // ============================================================

  isEmailValid(): boolean {
    return this.email.trim().includes('@');
  }

  // ============================================================
  // PASSWORD VALIDATION
  // ============================================================

  isPasswordValid(): boolean {
    return (
      this.password.length >= 12 &&
      /[A-Z]/.test(this.password) &&
      /[0-9]/.test(this.password) &&
      /[^A-Za-z0-9]/.test(this.password)
    );
  }

  // ============================================================
  // CONFIRM PASSWORD VALIDATION
  // ============================================================

  passwordsMatch(): boolean {
    return this.confirmPassword.length > 0 && this.password === this.confirmPassword;
  }

  // ============================================================
  // PASSWORD VISIBILITY
  // ============================================================

  clickPassword(event: MouseEvent): void {
    this.hidePassword.set(!this.hidePassword());
    event.stopPropagation();
  }

  clickConfirmPassword(event: MouseEvent): void {
    this.hideConfirmPassword.set(!this.hideConfirmPassword());
    event.stopPropagation();
  }

  // ============================================================
  // REGISTER
  // ============================================================

  async register(): Promise<void> {
    this.loading.set(true);

    this.errorMessage.set('');
    this.successMessage.set('');

    // ==========================================================
    // EMAIL VALIDATION
    // ==========================================================

    if (!this.isEmailValid()) {
      this.errorMessage.set('Email must contain @. Please enter a valid email address.');

      this.loading.set(false);
      return;
    }

    // ==========================================================
    // PASSWORD VALIDATION
    // ==========================================================

    if (!this.isPasswordValid()) {
      this.errorMessage.set(
        'Password must contain at least 12 characters, an uppercase letter, a number, and a special character.',
      );

      this.loading.set(false);
      return;
    }

    // ==========================================================
    // CONFIRM PASSWORD
    // ==========================================================

    if (this.password !== this.confirmPassword) {
      this.errorMessage.set('Passwords do not match.');

      this.loading.set(false);
      return;
    }

    // ==========================================================
    // REGISTER USER
    // ==========================================================

    try {
      const response = await this.authService.register({
        email: this.email,
        password: this.password,
        firstName: this.firstName,
        lastName: this.lastName,
        role: this.role,
      });

      this.successMessage.set(response);

      // Clear form
      this.firstName = '';
      this.lastName = '';
      this.email = '';
      this.password = '';
      this.confirmPassword = '';
      this.role = 'Student';

      // Hide passwords again
      this.hidePassword.set(true);
      this.hideConfirmPassword.set(true);
    } catch (error: any) {
      const errors = error?.error?.errors;

      if (errors && Array.isArray(errors)) {
        this.errorMessage.set(errors.join(', '));
      } else {
        this.errorMessage.set('Registration failed. Please check your information.');
      }
    } finally {
      this.loading.set(false);
    }
  }
}
