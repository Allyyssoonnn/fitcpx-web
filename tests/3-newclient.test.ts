import { test, expect } from '@playwright/test';

test('New Client', async ({ page }) => {
    await page.goto('http://localhost:5173/cadaluno');
    
    await page.fill('input[id="name"]', 'Test client');
    await page.fill('input[id="cpf"]', '10940113988');
    await page.fill('input[id="rg"]', '0000000');
    await page.fill('input[id="phone"]', '00000000000');
    await page.fill('input[id="birthdate"]', '2001-09-11');
    await page.selectOption('select[id="gender"]', 'M');
    await page.selectOption('select[id="ethnicity"]', 'Caucasiano');
    await page.fill('input[id="email"]', 'fitcomplex@fitcpx.com');
    await page.fill('input[id="password"]', '12345');
    await page.fill('input[id="cep"]', '87707050');
    await page.selectOption('select[id="state"]', 'PR');
    await page.fill('input[id="city"]', 'Paranavaí');
    await page.fill('input[id="address"]', 'Rua Paraíba');
    await page.fill('input[id="number"]', '1048');
    await page.fill('input[id="neighborhood"]', 'CENTRO');
    await page.fill('input[id="address2"]', '123');
    
    await page.click('button[id="sidebarCollapse"]');
    await page.click('button[id="submit"]');

    await expect(page).toHaveURL(/.*\/aluno/);
});