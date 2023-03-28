import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('img', { name: 'product' }).first().click();
  await page.getByRole('heading', { name: 'pangoro' }).click();
  await page.getByRole('button', { name: 'plus' }).first().dblclick();
  await page.getByRole('button', { name: 'Shop now' }).click();
  await page.getByRole('alert').filter({ hasText: 'pangoro (3x) agregado' }).click();
});
