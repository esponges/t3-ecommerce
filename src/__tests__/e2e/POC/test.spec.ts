import {
  test,
  expect,
  chromium
} from '@playwright/test';

const userDataDir = '/Users/fertostado/Library/Application Support/Google/Chrome/Profile 1';

test('proof of concept 1', async ({ page }) => {
  await page.goto('/');

  // use along with the --headed flag to see the browser and debug
  // await page.pause();

  // wait some time for the page to load
  await page.waitForTimeout(3000);

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

// test.describe('', () => {
//   test('login', async ({ page }) => {
//     // dont use incognito
//     // const context = await chromium.launchPersistentContext(userDataDir);
//     // const page = await context.newPage();
//     // await page.pause();

//     await page.goto('/');

//     const productCardImage = page.locator('[datatest-id="product-card-image"]').first();
//     await productCardImage.click();

//     // get the first element with product-item-name datatest-id
//     const productItemName = page.locator('[datatest-id="product-item-name"]').first();
//     expect(await productItemName.innerText()).toBeTruthy();

//     await page.getByRole('link', { name: 'Cart' }).click();
//     // get the first element with empty-cart-message datatest-id
//     const emptyCartMessage = page.locator('[datatest-id="empty-cart-message"]').first();
//     expect(await emptyCartMessage.innerText()).toBeTruthy();
//   });
// });
