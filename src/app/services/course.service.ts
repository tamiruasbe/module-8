import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Course, CourseDetail, PagedResponse } from '../models/course.model';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private http = inject(HttpClient);

  private baseUrl = 'http://localhost:5049/api/courses';

  //   getAll(page = 1, pageSize = 50) {
  //     return this.http
  //       .get<PagedResponse<Course>>(this.baseUrl, {
  //         params: {
  //           page: page.toString(),
  //           pageSize: pageSize.toString(),
  //         },
  //       })
  //       .pipe(map((p) => p.items));
  //   }
  getAll(page = 1, pageSize = 50) {
    return this.http.get<Course[]>(this.baseUrl, {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString(),
      },
    });
  }

  getById(id: string) {
    return this.http.get<CourseDetail>(`${this.baseUrl}/${id}`);
  }
}
