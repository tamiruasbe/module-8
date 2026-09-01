import { test as setup, expect } from '@playwright/test';
setup('authenticate as admin', async ({ page }) => {
  await page.goto('/login');
  // M10 & M12 baseline LoginRequest uses Email (with Username supported as fallback).
  await page
    .getByLabel(/email|username/i)
    .fill(process.env.TMS_ADMIN_EMAIL ?? process.env.TMS_ADMIN_USER!);
  //   await page.getByLabel('Password').fill(process.env.TMS_ADMIN_PASS!);
  await page.getByRole('textbox', { name: 'Password' }).fill(process.env.TMS_ADMIN_PASS!);
  await page.getByRole('button', { name: 'Sign In' }).click();
  // M9's InstructorDashboardComponent renders <h1>Instructor CommandCenter</h1>; the
  // regex matches that heading so we know post-login navigation resolved the protected route.
  await expect(page.getByRole('heading', { name: /command center/i })).toBeVisible();
  await page.context().storageState({ path: 'playwright/.auth/admin.json' });
});
