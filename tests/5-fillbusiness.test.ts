import { test, expect } from '@playwright/test';

test('Fill Business Info', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    await page.click('a[id="sidebarCollapse"]');

    await page.click('a[id="imgMenu"]');
    await page.click('a[id="imgMenu-config"]');
    await page.click('button[id="tab-business"]');

    await page.fill('input[id="cnpj"]', '59820051000102');
    await page.fill('input[id="name"]', 'LAB COMPLEX DEV');
    await page.fill('input[id="description"]', 'Test Business');
    await page.fill('input[id="phone"]', '44988084028');
    await page.fill('input[id="razao-social"]', 'LAB COMPLEX DEV LTDA');
    await page.fill('input[id="cellphone"]', '44988084028');
    await page.fill('input[id="cep"]', '87707050');
    await page.fill('input[id="city"]', 'Paranavaí');
    await page.fill('input[id="state"]', 'PR');
    await page.fill('input[id="address"]', 'Rua Paraíba');
    await page.fill('input[id="number"]', '1435');

    await page.click('button[id="submit"]');

    await expect(page).toHaveURL(/.*\/configuracao/);
});