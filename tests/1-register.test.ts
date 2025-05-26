import { test, expect } from '@playwright/test';

test('Register', async ({ page }) => {
    await page.goto('http://localhost:5173/entrar');
    await page.context().clearCookies();
    await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
    });

    await page.click('a[id="register"]');
    await expect(page).toHaveURL(/.*\/registrar/);

    await page.fill('input[id="name"]', 'Teste FitCpx');
    await page.fill('input[id="email"]', 'alyson.personalstudio@gmail.com');
    await page.fill('input[id="password"]', '24052025');
    await page.fill('input[id="confirm-password"]', '24052025');
    await page.click('input[id="acceptTerms"]');

    await page.click('button[id="register"]');
    await expect(page).toHaveURL(/.*\/dashboard/);
});