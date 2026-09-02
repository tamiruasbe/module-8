import { test as setup, expect } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(__dirname, '.env'),
});

setup('authenticate as admin', async ({ page }) => {
  await page.goto('/login');

  await page
    .getByLabel(/email|username/i)
    .fill(process.env.TMS_ADMIN_EMAIL ?? process.env.TMS_ADMIN_USER!);

  await page.getByRole('textbox', { name: 'Password' }).fill(process.env.TMS_ADMIN_PASS!);

  await page.getByRole('button', { name: 'Sign In' }).click();

  // Your application sends Admin users to /admin/courses.
  await expect(page).toHaveURL(/\/admin\/courses/);

  await page.context().storageState({
    path: 'playwright/.auth/admin.json',
  });
});
