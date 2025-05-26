import { test, expect } from '@playwright/test';

test('Login', async ({ page }) => {
    await page.goto('http://localhost:5173/entrar');
    await page.context().clearCookies();
    await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
    });

    await page.fill('input[id="email"]', 'alyson.personalstudio@gmail.com');
    await page.fill('input[id="password"]', '24052025');

    await page.click('button[id="sign-in"]');

    await expect(page).toHaveURL(/.*\/dashboard/);
});