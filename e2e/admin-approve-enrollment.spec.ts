// import { test, expect } from '@playwright/test';
// test('admin approves a pending enrollment', async ({ page }) => {
//   await page.goto('/dashboard');
//   // The dashboard heading text comes from M9's InstructorDashboardComponent template
//   // ("Instructor Command Center"); the spec's regex matches that exactly so a future
//   // copy edit doesn't silently break the auth-setup handoff.
//   await expect(page.getByRole('heading', { name: /command center/i })).toBeVisible();
//   // M9's EnrollmentListComponent renders a per-row "Approve" buttonon ly when the
//   // enrollment is still Pending. We click the first one and assert theoptimistic
//   // status flip from M9's EnrollmentStore shows up in the row's badge.
//   const firstApprove = page.getByRole('button', { name: 'Approve' }).first();
//   await firstApprove.click();
//   // The row's status badge flips to "Approved" instantly no navigation needed.
//   await expect(page.getByText('Approved').first()).toBeVisible();
// });
import { test, expect } from '@playwright/test';

test('admin approves a pending enrollment', async ({ page }) => {
  // Open your actual enrollment list page.
  await page.goto('/enrollments');

  // Find the first Pending enrollment's Approve button.
  const firstApprove = page.getByRole('button', { name: 'Approve' }).first();

  // Make sure the button exists.
  await expect(firstApprove).toBeVisible();

  // Approve the enrollment.
  await firstApprove.click();

  // The enrollment should now show Approved.
  await expect(page.getByText('Approved').first()).toBeVisible();
});
