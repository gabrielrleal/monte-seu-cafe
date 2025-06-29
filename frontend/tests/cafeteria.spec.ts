import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/');
});

test('Deve permitir que um usuário monte um café com sucesso, de ponta-a-ponta', async ({ page }) => {
  // Etapa 1: Selecionar a Base
  await test.step('Etapa 1: Selecionar Ingredientes Base', async () => {
    await page.getByRole('button', { name: 'Expresso' }).click();
    await page.getByRole('button', { name: 'Leite' }).click();
    await expect(page.locator('.resumo')).toContainText('Latte');
    await page.getByRole('button', { name: 'Confirmar Base' }).click();
  });

  // Etapa 2: Selecionar Adicionais
  await test.step('Etapa 2: Selecionar Ingredientes Adicionais', async () => {
    await expect(page.getByRole('heading', { name: '2. Escolha seus Adicionais' })).toBeVisible();
    await page.getByRole('button', { name: 'Canela' }).click();
    await expect(page.locator('.resumo')).toContainText('Latte com Canela');
    await page.getByRole('button', { name: 'Revisar Pedido' }).click();
  });

  // Etapa 3: Revisar e Confirmar
  await test.step('Etapa 3: Revisar e Confirmar o Pedido', async () => {
    await expect(page.getByRole('heading', { name: '3. Confirme seu Pedido' })).toBeVisible();
    await expect(page.locator('.resumo h3')).toHaveText('Latte com Canela');
    await page.getByRole('button', { name: 'Confirmar Pedido' }).click();
  });

  // Etapa 4: Verificar Tela de Sucesso
  await test.step('Etapa 4: Verificar Tela de Sucesso', async () => {
    await expect(page.getByRole('heading', { name: 'Pedido Realizado com Sucesso! ✅' })).toBeVisible();
  });
});