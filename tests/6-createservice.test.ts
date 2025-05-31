import { test, expect } from '@playwright/test';

test('Create Service', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    await page.click('a[id="finance"]');
    await page.click('a[id="services"]');
    await page.click('a[id="sidebarCollapse"]');
    await page.click('button[id="newService"]');
    
    await page.fill('input[id="name"]', 'Person');
    await page.fill('input[id="description"]', 'Test Person');
    await page.type('input[id="value"]', '80');
    await page.click('button[id="newVarService"]');
    
    await page.fill('input[id="nameVarService"]', '3x Week');
    await page.type('input[id="valueVarService"]', '365,50');
    
    await page.click('button[id="submitVarService"]');
    await page.click('button[id="submit"]');

    await expect(page).toHaveURL(/.*\/modalidades/);
});