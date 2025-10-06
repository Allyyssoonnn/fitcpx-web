import { expect, test } from "@playwright/test";

test("Fill Business Info", async ({ page }) => {
   await page.goto("http://localhost:5173/entrar");

   await page.locator("#email").click();
   await page.locator("#email").fill("fitcomplex@fitcpx.com");
   await page.locator("#password").click();
   await page.locator("#password").fill("12345");
   await page.getByRole("button", { name: "Entrar" }).click();

   await page.waitForTimeout(2000);
   await page.click('button[id="avatar"]');
   await page.click('div[id="avatar-config"]');
   await page.click('button[id="tab-business"]');

   await page.fill('input[id="cnpj"]', "59820051000102");
   await page.fill('input[id="name"]', "LAB COMPLEX DEV");
   await page.fill('input[id="description"]', "Test Business");
   await page.fill('input[id="phone"]', "44988084028");
   await page.fill('input[id="razao-social"]', "LAB COMPLEX DEV LTDA");
   await page.fill('input[id="cellphone"]', "44988084028");
   await page.fill('input[id="cep"]', "87707050");
   await page.fill('input[id="city"]', "Paranavaí");
   await page.fill('input[id="state"]', "PR");
   await page.fill('input[id="address"]', "Rua Paraíba");
   await page.fill('input[id="number"]', "1435");

   await page.click('button[id="submit"]');

   await expect(page).toHaveURL(/.*\/configuracao/);
});
