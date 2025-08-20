import { test, expect } from "@playwright/test";

test("Fill User Info", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  await page.click('a[id="admin"]');
  await page.click('a[id="users"]');
  await page.click('button[id="sidebarCollapse"]');
  await page.click('tr[id="user-0"]');

  await page.fill('input[id="idnumber"]', "10940113988");
  await page.fill('input[id="phone"]', "44988084028");
  await page.fill('input[id="cellphone"]', "44988084028");

  await page.fill('input[id="cep"]', "87707050");
  await page.waitForTimeout(7000);
  await page.fill('input[id="number"]', "688");

  await page.click('button[id="submit"]');

  await expect(page).toHaveURL(/.*\/usuarios/);
});
