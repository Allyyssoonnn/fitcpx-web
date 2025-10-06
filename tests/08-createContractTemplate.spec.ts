import { test } from "@playwright/test";

test("test", async ({ page }) => {
   await page.goto("http://localhost:5173/entrar");
   await page.locator("#email").click();
   await page.locator("#email").fill("fitcomplex@fitcpx.com");
   await page.locator("#password").click();
   await page.locator("#password").fill("12345");
   await page.getByRole("button", { name: "Entrar" }).click();

   await page.click('button[id="financeMenu"]');
   await page.click('a[id="contractTemplates"]');

   await page.click('button[id="newContractTemplate"]');

   await page.getByRole("textbox").click();
   await page.getByRole("textbox").fill("Fit Contract Test");
   await page.getByRole("button", { name: "Modelo consultoria" }).click();
   await page.getByRole("button", { name: "Confirmar" }).click();
});
