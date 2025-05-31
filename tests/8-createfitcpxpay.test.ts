import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('Create FitCpx Pay Business', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.click('a[id="sidebarCollapse"]');
    await page.click('button[id="open-fitcpxpay"]');
    await page.click('button[id="fitcpxpay-business"]');
    
    await page.fill('input[id="ownerbank"]', 'Teste FitCpx');
    await page.fill('input[id="codebank"]', '1234');
    await page.fill('input[id="agencybank"]', '1234');
    await page.fill('input[id="numberbank"]', '12345678');

    const frontDocPath = path.resolve(__dirname, 'img/front.png');
    const backDocPath = path.resolve(__dirname, 'img/back.png');

    const frontInput = page.locator('#frontDocBox input[type="file"]');
    await frontInput.setInputFiles(frontDocPath);

    const backInput = page.locator('#backDocBox input[type="file"]');
    await backInput.setInputFiles(backDocPath);

    await page.click('button[id="submit"]');

    await expect(page).toHaveURL(/.*\/dashboard/);
});