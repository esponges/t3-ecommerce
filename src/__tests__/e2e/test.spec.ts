import { test, expect } from '@playwright/test';

test('proof of concept', async ({ page }) => {
  await page.goto('/');
  
  // use along with the --headed flag to see the browser and debug
  // await page.pause();

  // get the first div with the product-card-image datatest-id
  const productCardImage = page.locator('[datatest-id="product-card-image"]').first();
  await productCardImage.click();

  // get the first element with product-item-name datatest-id
  const productItemName = page.locator('[datatest-id="product-item-name"]').first();
  expect(await productItemName.innerText()).toBeTruthy();

  
  await page.getByRole('link', { name: 'Cart' }).click();
  // get the first element with empty-cart-message datatest-id
  const emptyCartMessage = page.locator('[datatest-id="empty-cart-message"]').first();
  expect(await emptyCartMessage.innerText()).toBeTruthy();
});
