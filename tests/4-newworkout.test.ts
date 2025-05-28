import { test, expect } from '@playwright/test';

test('New Workout', async ({ page }) => {
    await page.goto('http://localhost:5173/alunos');
    
    await page.click('a[id="sidebarCollapse"]');
    await page.click('tr[id="aluno-0"]');
    await page.click('button[id="aluno-tabs-tab-treino"]');
    await page.click('button[id="addWorkout"]');
    await page.click('button[id="newWorkoutMethod"]');
    
    await expect(page).toHaveURL(/.*\/cadtreino/);
    
    await page.fill('input[id="name"]', '3x Week');
    await page.fill('input[id="periodicity"]', '2');
    await page.selectOption('select[id="difficulty"]', 'Intermediário');
    // await page.selectOption('select[id="gender"]', 'M');
    await page.fill('input[id="observation"]', 'Test Workout');
    await page.selectOption('select[id="development"]', 'Força');
    
    await page.click('button[id="addSessions"]');
    await page.click('button[id="btnSession-0"]');
    await page.click('button[id="addExercise-0"]');
    
    await page.waitForSelector('input[id="inputExercise-0-session-0"]');
    await page.fill('input[id="inputExercise-0-session-0"]', 'supino halter');
    
    await page.waitForSelector('ul[id="listExercises"]');
    await page.click('li[id="listExerciseOption-0"]'); 
    await page.fill('input[name="observationExercise-0-session-0"]', 'Teste Exercise Observation');
    await page.fill('input[name="intervalExercise-0-session-0"]', '90');
    await page.fill('input[name="setsExercise-0-session-0"]', '4');
    await page.fill('input[name="repsExercise-0-session-0"]', '15');

    await page.click('button[id="submit"]');
    await expect(page).toHaveURL(/.*\/aluno/);
});