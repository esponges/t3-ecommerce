import type { BrowserContext } from '@playwright/test';
import { chromium } from '@playwright/test';
import * as fs from 'fs/promises';
import * as path from 'path';

import { prisma } from '@/server/db/client';

type Cookie = Parameters<BrowserContext['addCookies']>[0][0];
const testCookie: Cookie = {
  name: 'next-auth.session-token',
  value: 'd52f0c50-b8e3-4326-b48c-4d4a66fdeb64', // some random id
  domain: 'localhost',
  path: '/',
  expires: 1678926378, // some random date, can be expired doesn't matter
  httpOnly: true,
  secure: false,
  sameSite: 'Lax',
};

export default async function globalSetup() {
  const now = new Date();

  await prisma.user.upsert({
    where: {
      email: 'octocat@github.com',
    },
    create: {
      name: 'Octocat',
      email: 'octocat@github.com',
      image: 'https://github.com/octocat.png',
      sessions: {
        create: {
          // create a session in db that hasn't expired yet, with the same id as the cookie
          expires: new Date(now.getFullYear(), now.getMonth() + 1, 0),
          sessionToken: testCookie.value,
        },
      },
      accounts: {
        // some random mocked discord account
        create: {
          type: 'oauth',
          provider: 'discord',
          providerAccountId: '123456789',
          access_token: 'ggg_zZl1pWIvKkf3UDynZ09zLvuyZsm1yC0YoRPt',
          token_type: 'bearer',
          scope: 'email identify',
        },
      },
    },
    update: {},
  });

  const storageStatePath = path.resolve(__dirname, 'storage-state.json');

  // Check if the storage state file exists, and if it does, load the cookies
  try {
    const storageState = path.resolve(__dirname, 'storage-state.json');
    const browser = await chromium.launch();
    const context = await browser.newContext({ storageState });
    await context.addCookies([testCookie]);
    await context.storageState({ path: storageState });
    console.log('context.storageState', context.cookies());
    await browser.close();
  } catch (err) {
    console.error(`Error loading storage state:`);
  }

  // Save the cookie to the storage state file
  const newStorageState = { cookies: [testCookie], origins: [] };
  try {
    await fs.writeFile(storageStatePath, JSON.stringify(newStorageState), 'utf8');
  } catch (err) {
    console.error(`Error saving storage state:`);
  }
}
