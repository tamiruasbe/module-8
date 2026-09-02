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
