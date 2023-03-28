import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('img', { name: 'product' }).first().click();
  await page.getByRole('link', { name: 'Cart' }).click();
  await page.getByText('Your cart is empty').click();

  // go to cart

  // expect datatest-id 'product-item-name' to be in the page
  // const productItemName = await page.$('[datatest-id="product-item-name"]');
  // expect(productItemName).toBeTruthy();
});
