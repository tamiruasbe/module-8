import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { Course, CourseEditModel, PagedResponse } from '../models/course.model';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private http = inject(HttpClient);

  private readonly base = `${environment.apiUrl}/courses`;

  getAll() {
    return this.http
      .get<PagedResponse<Course>>(this.base, {
        params: {
          page: '1',
          pageSize: '50',
        },
      })
      .pipe(map((response) => response.items));
  }

  getById(id: string) {
    return this.http.get<CourseEditModel>(`${this.base}/${id}`);
  }

  updateCourse(
    id: number,
    course: {
      id: number;
      code: string;
      title: string;
      maxCapacity: number;
    },
  ) {
    return this.http.put<void>(`${this.base}/${id}`, course);
  }

  createCourse(course: { code: string; title: string; maxCapacity: number }) {
    return this.http.post<void>(`${this.base}`, course);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
