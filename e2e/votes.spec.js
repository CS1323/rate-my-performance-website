// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Comment voting', () => {
  const waitForHomePageReady = async (/** @type {any} */ page) => {
    await page
      .getByText('Thinking About Hooking Up With Drew Dumontier?')
      .waitFor();
  };

  test('increments like count optimistically when like is clicked', async ({ page }) => {
    await page.goto('/');

    await waitForHomePageReady(page);
    // Wait for dev-seeded comment to load
    await page.getByText('First comment! This site is awesome.').waitFor();

    const likeButton = page
      .locator('button[aria-label^="Like this comment"]')
      .first();

    const initialLabel = await likeButton.getAttribute('aria-label');
    const initialCount = parseInt(
      /** @type {string} */ (initialLabel).match(/(\d+) likes/)?.[1] ?? '0',
      10
    );

    await likeButton.click();

    await expect(likeButton).toHaveAttribute(
      'aria-label',
      new RegExp(`Like this comment, ${initialCount + 1} likes`)
    );
  });

  test('removes like when the same button is clicked a second time', async ({ page }) => {
    await page.goto('/');

    await waitForHomePageReady(page);
    await page.getByText('First comment! This site is awesome.').waitFor();

    const likeButton = page
      .locator('button[aria-label^="Like this comment"]')
      .first();

    const initialLabel = await likeButton.getAttribute('aria-label');
    const initialCount = parseInt(
      /** @type {string} */ (initialLabel).match(/(\d+) likes/)?.[1] ?? '0',
      10
    );

    // Like then unlike — count should return to starting value
    await likeButton.click();
    await expect(likeButton).toHaveAttribute(
      'aria-label',
      new RegExp(`Like this comment, ${initialCount + 1} likes`)
    );

    await likeButton.click();
    await expect(likeButton).toHaveAttribute(
      'aria-label',
      new RegExp(`Like this comment, ${initialCount} likes`)
    );
  });
});
