import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormArray,
} from '@angular/forms';

@Component({
  selector: 'app-enrollment-form',
  standalone: true,
  styleUrls: ['./enrollment-form.scss'],

  // Required for Reactive Forms
  imports: [ReactiveFormsModule],

  templateUrl: './enrollment-form.html',
})
export class EnrollmentForm {
  // Angular injects FormBuilder so we can create the form.
  private fb = inject(FormBuilder);

  // Tracks whether the enrollment has been submitted.
  submitted = signal(false);

  form = this.fb.nonNullable.group({
    // Student ID
    // Required
    // Must match STU-1234 format

    studentId: ['', [Validators.required, Validators.pattern('^STU-[0-9]{4}$')]],

    // Course ID
    // Required

    courseId: ['', Validators.required],

    // Default term

    term: ['Fall 2026', Validators.required],

    // Optional notes

    notes: [''],

    // Dynamic list of backup courses

    backupCourses: this.fb.array<FormControl<string>>([]),
  });

  // Shortcut for backupCourses array

  get backups() {
    return this.form.controls.backupCourses;
  }

  addBackup() {
    this.backups.push(
      this.fb.control('', {
        nonNullable: true,

        validators: Validators.required,
      }),
    );
  }

  removeBackup(index: number) {
    this.backups.removeAt(index);
  }

  submit() {
    if (this.form.valid) {
      // Extract complete form values

      const payload = this.form.getRawValue();

      console.log('Enrollment payload:', payload);

      // Mark submission successful

      this.submitted.set(true);
    } else {
      // Show validation errors

      this.form.markAllAsTouched();
    }
  }
}
