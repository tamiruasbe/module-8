import { inject } from '@angular/core';

// import { EMPTY, catchError } from 'rxjs';
import { EMPTY, catchError, throwError } from 'rxjs';

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

    deleteCourse(id: number) {
      const previousSnapshot = store.entities();

      // Optimistically remove from UI
      patchState(store, removeEntity(id));

      return svc.delete(id).pipe(
        catchError((error) => {
          // Rollback if API fails
          patchState(store, setAllEntities(previousSnapshot));

          // Re-throw the error so the component can show Snackbar
          return throwError(() => error);
        }),
      );
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
