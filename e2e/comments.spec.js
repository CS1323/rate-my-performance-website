// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Comment submission', () => {
  test('shows a validation error when display name is missing', async ({ page }) => {
    await page.goto('/');

    await page.getByLabel('Comment').fill('Missing a display name');
    await page.getByRole('button', { name: 'Post comment' }).click();

    await expect(page.getByRole('alert')).toContainText('Please enter a display name');
  });

  test('shows a validation error when comment body is missing', async ({ page }) => {
    await page.goto('/');

    await page.getByLabel('Display name').fill('E2E Tester');
    await page.getByRole('button', { name: 'Post comment' }).click();

    await expect(page.getByRole('alert')).toContainText('Please enter a comment');
  });

  test('submits a new comment and displays it in the list', async ({ page }) => {
    await page.goto('/');
    // Wait for comment form to load before interacting
    await page.getByLabel('Display name').waitFor();

    await page.getByLabel('Display name').fill('E2E Tester');
    await page.getByLabel('Comment').fill('This is an automated E2E test comment.');
    await page.getByRole('button', { name: 'Post comment' }).click();

    // The new comment should appear after a successful POST
    await expect(page.getByText('This is an automated E2E test comment.')).toBeVisible();
    await expect(page.getByText('E2E Tester')).toBeVisible();
  });
});
