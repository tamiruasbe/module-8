// import { inject } from '@angular/core';
// import { EMPTY, catchError, tap } from 'rxjs';

// import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

// import { removeEntity, setAllEntities, withEntities } from '@ngrx/signals/entities';

// import { Course } from '../models/course.model';
// import { CourseService } from '../services/course.service';

// export const CourseStore = signalStore(
//   { providedIn: 'root' },

//   withEntities<Course>(),

//   withState({
//     error: '',
//   }),

//   withMethods((store, svc = inject(CourseService)) => ({
//     // ==========================================
//     // LOAD COURSES
//     // ==========================================
//     loadCourses() {
//       svc
//         .getAll()
//         .pipe(
//           catchError(() => {
//             patchState(store, {
//               error: 'Failed to load courses.',
//             });

//             return EMPTY;
//           }),
//         )
//         .subscribe((courses) => {
//           patchState(store, setAllEntities(courses));
//         });
//     },

//     // ==========================================
//     // OPTIMISTIC DELETE WITH ROLLBACK
//     // ==========================================
//     deleteCourse(id: number) {
//       // 1. Take snapshot BEFORE deleting
//       const previousSnapshot = store.entities();

//       // 2. Remove immediately from UI
//       patchState(store, removeEntity(id));

//       // 3. Send DELETE request
//       svc
//         .delete(id)
//         .pipe(
//           catchError(() => {
//             // 4. Restore previous courses
//             patchState(store, setAllEntities(previousSnapshot));

//             // Lab-required error message
//             patchState(store, {
//               error: 'Cannot delete course: active student enrollments exist.',
//             });

//             return EMPTY;
//           }),
//         )
//         .subscribe();
//     },
//   })),
// );
import { inject } from '@angular/core';

import { EMPTY, catchError } from 'rxjs';

import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

import { removeEntity, setAllEntities, withEntities } from '@ngrx/signals/entities';

import { Course } from '../models/course.model';
import { CourseService } from '../services/course.service';

export const CourseStore = signalStore(
  {
    providedIn: 'root',
  },

  withEntities<Course>(),

  withState({
    isLoading: false,
    error: '',
  }),

  withMethods((store, svc = inject(CourseService)) => ({
    loadCourses(): void {
      patchState(store, {
        isLoading: true,
        error: '',
      });

      svc
        .getAll()
        .pipe(
          catchError(() => {
            patchState(store, {
              isLoading: false,
              error: 'Failed to load courses.',
            });

            return EMPTY;
          }),
        )
        .subscribe((courses) => {
          patchState(store, setAllEntities(courses), {
            isLoading: false,
            error: '',
          });
        });
    },

    deleteCourse(id: number): void {
      const previousSnapshot = store.entities();

      patchState(store, removeEntity(id));

      svc
        .delete(id)
        .pipe(
          catchError(() => {
            patchState(store, setAllEntities(previousSnapshot));

            patchState(store, {
              error: 'Cannot delete course: ' + 'active student enrollments exist.',
            });

            return EMPTY;
          }),
        )
        .subscribe();
    },
    updateCourse(course: Course): void {
      svc
        .updateCourse(course.id, {
          id: course.id,
          code: course.code,
          title: course.title,
          maxCapacity: course.maxCapacity,
        })
        .pipe(
          catchError(() => {
            patchState(store, {
              error: 'Failed to update course.',
            });

            return EMPTY;
          }),
        )
        .subscribe(() => {
          // Update the course in the local Angular store.
          const updatedCourses = store
            .entities()
            .map((item) => (item.id === course.id ? course : item));

          patchState(store, setAllEntities(updatedCourses));
        });
    },
  })),
);
