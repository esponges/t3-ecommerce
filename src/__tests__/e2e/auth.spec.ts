import { test } from '@playwright/test';
import { mockedUserName } from './setup/global';

test.describe('authed used', () => {
  test('assert is logged in a log him out', async ({ page }) => {
    await page.goto('/');

    const greetingButton = page.getByText(`Hello ${mockedUserName}`);
    
    // get the greeting button with the datatest-id greeting-btn
    await greetingButton.click();
    await page.getByText('Account').click();

    // empty order page
    await page.getByRole('heading', { name: 'Tus pedidos' }).click();
    await page.getByText('Puedes ver los productos que tenemos disponibles en la página principal').click();

    // logout
    await greetingButton.click();
    await page.getByText('Log Out').click();

    // login
    await page.getByText('Hello , guest').click();
    await page.getByText('Log In').click();
    await page.getByText('Please sign in to continue').click();
    await page.locator('div').filter({ hasText: 'Hello!Please sign in to continueDiscord' }).nth(2).click();
  });
});
