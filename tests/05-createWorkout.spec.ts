import { test } from "@playwright/test";

test("Create Workout Pattern", async ({ page }) => {
   await page.goto("http://localhost:5173/entrar");
   await page.locator("#email").click();
   await page.locator("#email").fill("fitcomplex@fitcpx.com");
   await page.locator("#password").click();
   await page.locator("#password").fill("12345");
   await page.getByRole("button", { name: "Entrar" }).click();

   await page.click('button[id="workoutsMenu"]');
   await page.click('a[id="workouts"]');
   await page.click('button[id="newWorkout"]');

   await page.locator("#name").click();
   await page.locator("#name").fill("Workout Pattern");
   await page.locator("#periodicity").click();
   await page.locator("#periodicity").fill("3");

   await page.locator("#gender").click();
   await page.locator("#gender-1").click();
   await page.locator("#difficulty").click();
   await page.locator("#difficulty-1").click();
   await page.locator("#observation").click();
   await page.locator("#observation").fill("Observation Test");
   await page.locator("#development").click();
   await page.locator("#development-1").click();

   await page.locator("#addSessions").click();

   await page.getByRole("button", { name: " Sessão A" }).click();
   await page.getByRole("button", { name: " Adicionar exercício" }).click();
   await page.locator('button[name="exercise-0-session-0-set-null"]').click();
   await page.locator('input[name="input-exercise-0-session-0-set-null"]').fill("agachamento barr");
   await page.getByText("Agachamento com Barra").click();

   await page.locator("#addSessions").click();
   await page.locator("#btnSession-1").click();

   await page.locator("#addExercise-1").click();
   await page.locator('button[name="exercise-0-session-1-set-null"]').click();
   await page.locator('input[name="input-exercise-0-session-1-set-null"]').fill("Supino Decl");
   await page.getByText("Supino Declinado com Barra").click();

   await page.locator("#submit").click();
});
