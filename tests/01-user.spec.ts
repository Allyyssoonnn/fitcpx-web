import { expect, test } from "@playwright/test";

test("Register New User", async ({ page }) => {
   await page.goto("http://localhost:5173/entrar");
   await page.getByRole("link", { name: "Criar conta" }).click();
   await expect(page).toHaveURL(/.*\/registrar/);
   await page.locator("#name").click();
   await page.locator("#name").fill("Fit Test");
   await page.locator("#email").click();
   await page.locator("#email").fill("fitcomplex@fitcpx.com");
   await page.locator("#password").click();
   await page.locator("#password").fill("12345");
   await page.locator("#confirm-password").click();
   await page.locator("#confirm-password").fill("12345");
   await page.getByRole("button", { name: "Registrar" }).click();
   await expect(page).toHaveURL(/.*\/dashboard/);
});

test("Sign in User", async ({ page }) => {
   await page.goto("http://localhost:5173/entrar");
   await page.locator("#email").click();
   await page.locator("#email").fill("fitcomplex@fitcpx.com");
   await page.locator("#password").click();
   await page.locator("#password").fill("12345");
   await page.getByRole("button", { name: "Entrar" }).click();
   await expect(page).toHaveURL(/.*\/dashboard/);
});
