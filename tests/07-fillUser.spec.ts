import { expect, test } from "@playwright/test";

test("Fill User Info - User Form", async ({ page }) => {
   await page.goto("http://localhost:5173/entrar");
   await page.locator("#email").click();
   await page.locator("#email").fill("fitcomplex@fitcpx.com");
   await page.locator("#password").click();
   await page.locator("#password").fill("12345");
   await page.getByRole("button", { name: "Entrar" }).click();

   await page.click('button[id="adminMenu"]');
   await page.click('a[id="users"]');
   await page.click('tr[id="user-0"]');

   await page.fill('input[id="idnumber"]', "10940113988");
   await page.fill('input[id="cellphone"]', "+5544988084028");

   await page.fill('input[id="cep"]', "87707050");
   await page.waitForTimeout(3000);
   await page.fill('input[id="number"]', "688");

   await page.click('button[id="submit"]');

   await expect(page).toHaveURL(/.*\/users/);
});
