import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface GradePayload {
  studentId: number;
  courseId: number;
  score: number;
}

@Service()
export class GradeService {
  private http = inject(HttpClient);

  postGrade(payload: GradePayload): Observable<{ id: string; success: boolean }> {
    return this.http.post<{ id: string; success: boolean }>('/api/grades', payload);
  }
}

// import { Injectable, inject } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { delay, Observable, of } from 'rxjs';

// export interface GradePayload {
//   studentId: number;
//   courseId: number;
//   score: number;
// }

// @Injectable({
//   providedIn: 'root',
// })
// export class GradeService {
//   private http = inject(HttpClient);

//   postGrade(payload: GradePayload): Observable<{ id: string; success: boolean }> {
//     console.log('Grade request started:', payload);

//     return of({
//       id: crypto.randomUUID(),
//       success: true,
//     }).pipe(delay(5000));
//   }
// }
