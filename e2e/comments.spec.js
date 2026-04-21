// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Comment submission', () => {
  const waitForHomePageReady = async (/** @type {any} */ page) => {
    await page
      .getByText('Thinking About Hooking Up With Drew Dumontier?')
      .waitFor();
  };

  test('shows a validation error when display name is missing', async ({ page }) => {
    await page.goto('/');
    await waitForHomePageReady(page);

    await page.getByLabel('Comment').first().fill('Missing a display name');
    await page.getByRole('button', { name: 'Post comment' }).first().click();

    await expect(page.getByRole('alert')).toContainText('Display name required');
  });

  test('shows a validation error when comment body is missing', async ({ page }) => {
    await page.goto('/');
    await waitForHomePageReady(page);

    await page.getByLabel('Display name').first().fill('E2E Tester');
    await page.getByRole('button', { name: 'Post comment' }).first().click();

    await expect(page.getByRole('alert')).toContainText('Please enter a Comment');
  });

  test('submits a new comment and displays it in the list', async ({ page }) => {
    await page.goto('/');
    await waitForHomePageReady(page);

    await page.getByLabel('Display name').first().fill('E2E Tester');
    await page.getByLabel('Comment').first().fill('This is an automated E2E test comment.');
    await page.getByRole('button', { name: 'Post comment' }).first().click();

    // The new comment should appear in the comments list after a successful POST
    // Look for the comment text in the comments-list div, not in the form
    await expect(page.locator('.comments-list').getByText('This is an automated E2E test comment.').first()).toBeVisible();
    await expect(page.locator('.comments-list').getByText('E2E Tester').first()).toBeVisible();
  });
});
