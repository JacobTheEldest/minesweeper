import { test, expect } from '@playwright/test';

test.describe('Minesweeper app', () => {
  test('page has correct title', async ({ page }) => {
    await page.goto('http://localhost:3000/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Minesweeper/);
  });

  test('game-result is empty at the start of the game', async ({ page }) => {
    await page.goto('http://localhost:3000/');

    // Create game-result locator
    const gameResult = page.locator('.game-result');

    // Expects game-result to be empty at the start of the game
    await expect(gameResult).toBeEmpty();
  });
});
