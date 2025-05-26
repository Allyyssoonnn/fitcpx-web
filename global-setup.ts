import { chromium } from '@playwright/test';

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2RfdXN1YXJpbyI6OTk5LCJub21lX3VzdWFyaW8iOiJEZXYgVGVzdCIsImNvZF9lbXByZXNhIjo5OTksImlhdCI6MTcxNjczNjEwNywiZXhwIjoxNzE2NzYyMTA3fQ.Y-5j7Q_d1XesAzmBOCHgl0RUdGkrhXYNdsWYWiLZ2mU';

async function globalSetup() {
  const browser = await chromium.launch();
  const context = await browser.newContext();

  await context.addCookies([
    {
      name: 'token',
      value: token,
      domain: 'localhost',
      path: '/',
      httpOnly: false,
      secure: false,
      sameSite: 'Lax',
    },
    {
      name: 'refreshToken',
      value: token,
      domain: 'localhost',
      path: '/',
      httpOnly: false,
      secure: false,
      sameSite: 'Lax',
    },
  ]);

  await context.storageState({ path: 'state.json' });
  await browser.close();
}

export default globalSetup;