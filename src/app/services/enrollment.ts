// }
import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Enrollment } from '../models/enrollment.model';

@Service()
export class EnrollmentService {
  private http = inject(HttpClient);

  private readonly base = `${environment.enrollmentApiUrl}/enrollments`;

  getAll(): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(this.base);
  }

  approve(id: string): Observable<void> {
    return this.http.post<void>(`${this.base}/${id}/approve`, {});
  }

  enroll(studentId: number, courseCode: string) {
    return this.http.post(this.base, {
      studentId,
      courseCode,
    });
  }
}
