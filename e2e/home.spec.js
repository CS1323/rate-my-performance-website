// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  const waitForHomePageReady = async (/** @type {any} */ page) => {
    await page
      .getByText('Thinking About Hooking Up With Drew Dumontier?')
      .waitFor();
  };

  test('displays the post title', async ({ page }) => {
    await expect(
      page.getByText('Thinking About Hooking Up With Drew Dumontier?')
    ).toBeVisible();
  });

  test('displays the How to Join the Discussion section', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'How to Join the Discussion' })
    ).toBeVisible();
  });

  test('shows the comment form', async ({ page }) => {
    await waitForHomePageReady(page);

    await expect(page.getByLabel('Display name').first()).toBeVisible();
    await expect(page.getByLabel('Comment').first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Post comment' }).first()).toBeVisible();
  });

  test('renders seeded comments', async ({ page }) => {
    await waitForHomePageReady(page);
    await page.getByText('First comment! This site is awesome.').waitFor();
    
    await expect(
      page.getByText('First comment! This site is awesome.')
    ).toBeVisible();
    // await expect(
    //   page.getByText("Can't wait to see what people post here!")
    // ).toBeVisible();
  });
});
