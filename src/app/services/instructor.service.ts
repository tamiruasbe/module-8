import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Instructor } from '../models/instructor.model';

@Injectable({
  providedIn: 'root',
})
export class InstructorService {
  private readonly http = inject(HttpClient);

  private readonly base = `${environment.apiUrl}/instructors`;

  getAll() {
    return this.http.get<Instructor[]>(this.base);
  }

  assignInstructor(courseId: number, instructorId: string) {
    return this.http.put<{ message: string }>(`${this.base}/courses/${courseId}`, {
      instructorId,
    });
  }

  removeInstructor(courseId: number) {
    return this.http.delete<{ message: string }>(`${this.base}/courses/${courseId}`);
  }
}
