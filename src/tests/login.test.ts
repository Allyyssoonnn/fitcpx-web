import { test, expect } from '@playwright/test';

test('Success Login', async ({ page }) => {
    await page.goto('http://localhost:5173/entrar');

    await page.fill('input[id="email"]', 'miltongasparotto.jr@gmail.com');
    await page.fill('input[id="password"]', '1973');

    await page.click('button[id="sign-in"]');

    await expect(page).toHaveURL(/.*\/dashboard/);
});