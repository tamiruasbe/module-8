import { Component, OnInit, inject } from '@angular/core';

import { AuthService } from '../../services/auth.service';

import { CourseStore } from '../../store/course.store';
import { Course } from '../../models/course.model';

@Component({
  selector: 'tms-admin-course-list',
  standalone: true,
  templateUrl: './admin-course-list.html',
  styleUrl: './admin-course-list.scss',
})
export class AdminCourseList implements OnInit {
  readonly store = inject(CourseStore);

  readonly auth = inject(AuthService);

  ngOnInit(): void {
    this.store.loadCourses();
  }

  deleteCourse(id: number): void {
    this.store.deleteCourse(id);
  }

  editCourse(course: Course): void {
    const title = window.prompt('Enter new course title:', course.title);

    if (title === null || title.trim() === '') {
      return;
    }

    const updatedCourse: Course = {
      ...course,
      title: title.trim(),
    };

    this.store.updateCourse(updatedCourse);
  }
}
