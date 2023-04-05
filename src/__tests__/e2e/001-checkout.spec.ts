import { test } from '@playwright/test';

test.describe('Checkout', () => {
  test('authed user should be able to checkout', async ({ page }) => {
    // consider user will be already logged in
    await page.pause();

    await page.goto('/');

    // go to the first product and add it to cart
    await page.getByRole('img', { name: 'product' }).first().click();

    // add to cart
    await page.getByRole('button', { name: 'Shop now' }).click();

    // go to cart
    await page.getByRole('link', { name: 'Cart 1' }).click();

    // continue to checkout
    await page.getByRole('button', { name: 'Continue' }).click();

    // shallow check: check if the order details are there
    await page.getByRole('heading', { name: 'Order Details' }).click();
  });
});
