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
    await page.fill('input[id="password"]', '12345');
    await page.fill('input[id="confirm-password"]', '12345');
    await page.click('input[id="acceptTerms"]');
    
    await page.click('button[id="register"]');
    await expect(page).toHaveURL(/.*\//);

    await page.fill('input[id="email-code"]', '1234');
    await page.click('a[id="sidebarCollapse"]');
    await page.click('button[id="confirm-email"]');
});