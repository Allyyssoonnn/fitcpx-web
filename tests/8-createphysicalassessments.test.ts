import { test, expect } from '@playwright/test';

test('Create Physical Assessments', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    await page.click('a[id="clients"]');
    await page.click('button[id="sidebarCollapse"]');
    await page.click('tr[id="aluno-0"]');
    await page.click('button[id="aluno-tabs-tab-avaliacaoFisica"]');
    await page.click('button[id="addPhysicalAssessment"]');

    await expect(page).toHaveURL(/.*\/cadavaliacao/);

    await page.selectOption('select[id="select-protocol"]', '3');
    await page.selectOption('select[id="select-type"]', 'complexo');

    await page.fill('input[id="date"]', '2025-05-30');
    await page.fill('input[id="weight"]', '80');
    await page.fill('input[id="height"]', '1.73');

    await page.click('button[id$="tab-diametros"]');
    
    await page.fill('input[id="biestiloide_punho"]', '4.70');
    await page.fill('input[id="biepicondilo_umeral"]', '7');
    await page.fill('input[id="biepicondilo_femoral"]', '9.40');
    
    await page.click('button[id$="tab-bioimpedancia"]');
    
    await page.fill('input[id="gordura_viceral"]', '8');
    await page.fill('input[id="bioimpedancia_gordura"]', '20');
    await page.fill('input[id="bioimpedancia_muscular"]', '50');
    await page.fill('input[id="bioimpedancia_idade"]', '30');
    
    await page.click('button[id$="tab-dobras"]');

    await page.fill('input[id="subescapular"]', '15.40');
    await page.fill('input[id="triciptal"]', '7');
    await page.fill('input[id="biciptal"]', '13.80');
    await page.fill('input[id="peitoral"]', '8.2');
    await page.fill('input[id="axilar_media"]', '8.9');
    await page.fill('input[id="supra_iliaca"]', '11.9');
    await page.fill('input[id="supra_espinhal"]', '10');
    await page.fill('input[id="abdominal"]', '30.6');
    await page.fill('input[id="coxa"]', '18.60');
    await page.fill('input[id="panturrilha"]', '7.30');

    await page.click('button[id$="tab-perimetros"]');
    
    await page.fill('input[id="pescoco"]', '36.90');
    await page.fill('input[id="ombro"]', '121.70');
    await page.fill('input[id="torax_expirado"]', '97.80');
    await page.fill('input[id="torax_inspirado"]', '101.80');
    await page.fill('input[id="cintura"]', '83.70');
    await page.fill('input[id="abdomen"]', '86');
    await page.fill('input[id="quadril"]', '101.70');

    await page.fill('input[id="braco_relaxado_direito"]', '31.20');
    await page.fill('input[id="braco_contraido_direito"]', '36.70');
    await page.fill('input[id="antebraco_direito"]', '28.30');
    await page.fill('input[id="coxa_direita"]', '57.70');
    await page.fill('input[id="panturrilha_direita"]', '35.60');

    await page.fill('input[id="braco_relaxado_esquerdo"]', '32.70');
    await page.fill('input[id="braco_contraido_esquerdo"]', '36.60');
    await page.fill('input[id="antebraco_esquerdo"]', '29.20');
    await page.fill('input[id="coxa_esquerda"]', '57.70');
    await page.fill('input[id="panturrilha_esquerda"]', '35.60');

    await page.click('button[id="submit"]');
    
    await expect(page).toHaveURL(/.*\/aluno/);
});