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

  // Password visibility
  hidePassword = signal(true);
  hideConfirmPassword = signal(true);

  firstName = '';
  lastName = '';
  email = '';
  password = '';
  confirmPassword = '';
  role = 'Student';

  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  clickPassword(event: MouseEvent) {
    this.hidePassword.set(!this.hidePassword());
    event.stopPropagation();
  }

  clickConfirmPassword(event: MouseEvent) {
    this.hideConfirmPassword.set(!this.hideConfirmPassword());
    event.stopPropagation();
  }

  async register() {
    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    // Check if passwords match
    if (this.password !== this.confirmPassword) {
      this.errorMessage.set('Passwords do not match.');
      this.loading.set(false);
      return;
    }

    try {
      const response = await this.authService.register({
        email: this.email,
        password: this.password,
        firstName: this.firstName,
        lastName: this.lastName,
        role: this.role,
      });

      this.successMessage.set(response);

      // Clear the form
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
