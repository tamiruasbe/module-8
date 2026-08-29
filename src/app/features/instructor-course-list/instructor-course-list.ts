import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../../services/auth.service';
import { CourseStore } from '../../store/course.store';

@Component({
  selector: 'tms-instructor-course-list',
  standalone: true,
  templateUrl: './instructor-course-list.html',
  styleUrl: './instructor-course-list.scss',
})
export class InstructorCourseList implements OnInit {
  readonly store = inject(CourseStore);
  readonly auth = inject(AuthService);

  private router = inject(Router);
  // private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.store.loadCourses();
  }

  editCourse(id: number): void {
    this.router.navigate(['/courses/edit', id]);
  }
}
