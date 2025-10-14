import { expect, test } from "@playwright/test";

test("Create Student", async ({ page }) => {
   await page.goto("http://localhost:5173/entrar");
   await page.locator("#email").click();
   await page.locator("#email").fill("fitcomplex@fitcpx.com");
   await page.locator("#password").click();
   await page.locator("#password").fill("12345");
   await page.getByRole("button", { name: "Entrar" }).click();

   await page.locator("#clients").click();
   await page.locator("#newClient").click();
   await page.locator("#name").click();
   await page.locator("#name").fill("Fit Student Test");
   await page.locator("#cpf").click();
   await page.locator("#cpf").fill("10940113988");
   await page.locator("#rg").click();
   await page.locator("#rg").fill("12345");
   await page.locator("#phone").click();
   await page.locator("#phone").fill("+5544988084028");
   await page.locator("#birthdate").fill("2001-09-11");
   await page.locator("#gender").click();
   await page.locator("#gender-0").click();
   await page.locator("#ethnicity").click();
   await page.locator("#ethnicity-0").click();
   await page.locator("#email").click();
   await page.locator("#email").fill("fitcomplex@fitcpx.com");
   await page.locator("#cep").click();
   await page.locator("#cep").fill("87707050");
   await page.waitForTimeout(5000);
   await page.locator("#number").click();
   await page.locator("#number").fill("688");
   await page.locator("#address2").click();
   await page.locator("#address2").fill("Complement");
   await page.locator("#submit").click();
   await page.getByRole("button", { name: "OK" }).click();
});

test("Verify Stundent Created", async ({ page }) => {
   await page.goto("http://localhost:5173/entrar");
   await page.locator("#email").click();
   await page.locator("#email").fill("fitcomplex@fitcpx.com");
   await page.locator("#password").click();
   await page.locator("#password").fill("12345");
   await page.getByRole("button", { name: "Entrar" }).click();

   await page.locator("#clients").click();
   await page.locator("#clients-0").click();

   await expect(page).toHaveURL(/.*\/aluno/);

   await page.waitForSelector("#student-name", { timeout: 10000 });
   await expect(page.locator("#student-name")).toHaveText("Fit Student Test");
   await expect(page.locator("#student-email")).toHaveText("fitcomplex@fitcpx.com");
   await expect(page.locator("#student-phone")).toHaveText("+5544988084028");
   await expect(page.locator("#student-gender")).toHaveText("Masculino");
   await expect(page.locator("#student-birthday")).toHaveText("11/09/2001");
});

test("Test Status Handle Stundent Created", async ({ page }) => {
   await page.goto("http://localhost:5173/entrar");
   await page.locator("#email").click();
   await page.locator("#email").fill("fitcomplex@fitcpx.com");
   await page.locator("#password").click();
   await page.locator("#password").fill("12345");
   await page.getByRole("button", { name: "Entrar" }).click();

   await page.locator("#clients").click();
   await page.locator("#clients-0").click();

   await expect(page).toHaveURL(/.*\/aluno/);

   await expect(page.locator("#student-status")).toHaveText("Ativo");
   await page.locator("#student-handlestatus").click();
   await expect(page.locator("#student-status")).toHaveText("Inativo");
   await page.locator("#student-handlestatus").click();
   await expect(page.locator("#student-status")).toHaveText("Ativo");
});

test("Test Edit Stundent Created", async ({ page }) => {
   await page.goto("http://localhost:5173/entrar");
   await page.locator("#email").click();
   await page.locator("#email").fill("fitcomplex@fitcpx.com");
   await page.locator("#password").click();
   await page.locator("#password").fill("12345");
   await page.getByRole("button", { name: "Entrar" }).click();

   await page.locator("#clients").click();
   await page.locator("#clients-0").click();

   await expect(page).toHaveURL(/.*\/aluno/);

   await page.locator("#student-edit").click();
   await expect(page).toHaveURL(/.*\/cadaluno/);

   await page.locator("#name").click();
   await page.locator("#name").fill("Fit Student");
   await page.locator("#submit").click();
   await page.getByRole("button", { name: "OK" }).click();

   await expect(page).toHaveURL(/.*\/aluno/);
   await expect(page.locator("#student-name")).toHaveText("Fit Student");
});
