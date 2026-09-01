import { computed, inject } from '@angular/core';
import { signalStore, withComputed, withMethods, patchState, withState } from '@ngrx/signals';

import { withEntities, setAllEntities, updateEntity } from '@ngrx/signals/entities';

import { rxMethod } from '@ngrx/signals/rxjs-interop';

import { pipe, concatMap, switchMap, tap, catchError, EMPTY } from 'rxjs';

import { EnrollmentService } from '../services/enrollment';
import { LiveSyncService } from '../services/live-sync';
import { Enrollment } from '../models/enrollment.model';

export const EnrollmentStore = signalStore(
  { providedIn: 'root' },

  withState({
    isLoading: false,
    error: null as string | null,
  }),

  withEntities<Enrollment>(),

  withComputed((store) => ({
    pendingCount: computed(() => store.entities().filter((e) => e.status === 'Pending').length),

    approvedCount: computed(() => store.entities().filter((e) => e.status === 'Approved').length),

    rejectedCount: computed(() => store.entities().filter((e) => e.status === 'Rejected').length),
  })),

  withMethods((store, api = inject(EnrollmentService), sync = inject(LiveSyncService)) => ({
    seed: (rows: Enrollment[]) => {
      patchState(store, setAllEntities(rows));
    },

    loadEnrollments: rxMethod<void>(
      pipe(
        tap(() =>
          patchState(store, {
            isLoading: true,
            error: null,
          }),
        ),

        concatMap(() =>
          api.getAll().pipe(
            tap((rows) => {
              const fixedRows = rows.map((r) => ({
                ...r,
                status: r.status || 'Pending',
              }));

              patchState(store, setAllEntities(fixedRows), {
                isLoading: false,
              });
            }),

            catchError((err) => {
              patchState(store, {
                isLoading: false,
                error: err.message || 'Failed to load enrollments.',
              });

              return EMPTY;
            }),
          ),
        ),
      ),
    ),

    approveEnrollment: rxMethod<string>(
      pipe(
        tap((id) => {
          // Immediately update the UI before
          // the server responds.
          patchState(
            store,
            updateEntity({
              id,
              changes: {
                status: 'Approved',
              },
            }),
          );
        }),

        concatMap((id) =>
          api.approve(id).pipe(
            catchError(() => {
              // If the server rejects the approval,
              // restore the previous status.
              patchState(
                store,
                updateEntity({
                  id,
                  changes: {
                    status: 'Pending',
                  },
                }),
              );

              patchState(store, {
                error: 'Server rejected the approval. Check enrollment constraints.',
              });

              return EMPTY;
            }),
          ),
        ),
      ),
    ),

    listenForLiveUpdates: rxMethod<void>(
      pipe(
        // Start the SignalR connection.
        tap(() => sync.connect()),

        // Listen continuously for events from SignalR.
        switchMap(() => sync.events$),

        // Update the matching enrollment in the store.
        tap((event) => {
          patchState(
            store,
            updateEntity({
              id: event.id,
              changes: {
                status: event.status,
              },
            }),
          );
        }),
      ),
    ),
  })),
);
