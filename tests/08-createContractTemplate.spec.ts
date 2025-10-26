import { test } from "@playwright/test";

test("Create Contract Pattern", async ({ page }) => {
   await page.goto("http://localhost:5173/entrar");
   await page.locator("#email").click();
   await page.locator("#email").fill("fitcomplex@fitcpx.com");
   await page.locator("#password").click();
   await page.locator("#password").fill("12345");
   await page.getByRole("button", { name: "Entrar" }).click();

   await page.click('button[id="financeMenu"]');
   await page.click('a[id="contractTemplates"]');

   await page.click('button[id="newContractTemplate"]');

   await page.locator("#name").fill("Fit Contract Test");

   await page.locator("#templatesDropdown").click();
   await page.locator("#templatesDropdown-0").click();

   await page.click('button[id="submit"]');
});
