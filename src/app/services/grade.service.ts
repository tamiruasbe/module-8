// import { inject, Service } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// export interface GradePayload {
//   studentId: number;
//   courseId: number;
//   score: number;
// }

// @Service()
// export class GradeService {
//   private http = inject(HttpClient);

//   postGrade(payload: GradePayload): Observable<{ id: string; success: boolean }> {
//     return this.http.post<{ id: string; success: boolean }>('/api/grades', payload);
//   }
// }
import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface GradePayload {
  studentId: number;
  courseId: number;
  score: number;
}

@Service()
export class GradeService {
  private http = inject(HttpClient);

  private readonly base = `${environment.apiUrl}/grades`;

  postGrade(payload: GradePayload): Observable<{
    id: string;
    success: boolean;
  }> {
    return this.http.post<{
      id: string;
      success: boolean;
    }>(this.base, payload);
  }
}
