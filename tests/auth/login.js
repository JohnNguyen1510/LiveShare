const path = require('path');
const fs = require('fs');

const screenshotsDir = path.join(__dirname, '../../screenshots');
const authDir = path.join(__dirname, '../../auth');
const authFile = path.join(authDir, 'user-auth.json');

// Ensure directories exist
if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir);
if (!fs.existsSync(authDir)) fs.mkdirSync(authDir);

async function handleGoogleAuth(popup) {
  await popup.waitForLoadState('networkidle', { timeout: 30000 });
  await popup.screenshot({ path: path.join(screenshotsDir, '4-google-popup.png') });

  const email = process.env.GOOGLE_EMAIL ;
  const password = process.env.GOOGLE_PASSWORD ;

  try {
    console.log('Filling Google credentials');
    const emailInput = popup.locator('input[type="email"]');
    await emailInput.waitFor({ state: 'visible', timeout: 10000 });
    await emailInput.fill(email);
    await popup.screenshot({ path: path.join(screenshotsDir, '4a-filled-email.png') });

    const nextButton = popup.getByRole('button', { name: /next/i });
    await nextButton.click({ force: true });

    await popup.waitForTimeout(3000);
    await popup.screenshot({ path: path.join(screenshotsDir, '4b-password-screen.png') });

    const passwordInput = popup.locator('input[type="password"]');
    await passwordInput.waitFor({ state: 'visible', timeout: 10000 });
    await passwordInput.fill(password);
    await popup.screenshot({ path: path.join(screenshotsDir, '4c-filled-password.png') });

    await popup.getByRole('button', { name: /next|sign in/i }).click({ force: true });

    await popup.waitForEvent('close', { timeout: 30000 }).catch(() => {
      console.warn('Google auth popup did not close as expected, continuing with test');
    });
    console.log('Google authentication completed');
  } catch (error) {
    console.error('Error during Google authentication:', error);
    await popup.screenshot({ path: path.join(screenshotsDir, 'auth-error.png') });
    throw error;
  }
}

async function login(page, context) {
  await page.goto('https://app.livesharenow.com/');
  await page.screenshot({ path: path.join(screenshotsDir, 'start-page.png') });

  const signInButton = page.getByRole('button', { name: /sign in/i });
  await expect(signInButton).toBeVisible({ timeout: 10000 });
  await signInButton.click();

  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(screenshotsDir, 'auth-modal.png') });
  console.log('Starting Google authentication process...');

  try {
    await page.waitForTimeout(5000);
    const frames = page.frames();
    console.log(`Found ${frames.length} frames`);

    let googleFrame = null;
    for (const frame of frames) {
      if (frame.url().includes('accounts.google.com/gsi')) {
        googleFrame = frame;
        console.log('Found Google GSI iframe');
        break;
      }
    }

    if (googleFrame) {
      await page.waitForTimeout(2000);
      try {
        const buttonLocator = googleFrame.locator('div[role="button"]');
        const isButtonVisible = await buttonLocator.isVisible();
        if (isButtonVisible) {
          console.log('Clicking Google sign-in button in iframe');
          const [popup] = await Promise.all([
            context.waitForEvent('page', { timeout: 30000 }),
            buttonLocator.click({ force: true, timeout: 15000 }),
          ]);
          await handleGoogleAuth(popup);
          await page.waitForURL('**/manage', { timeout: 30000 });
          console.log('Saving authentication state');
          await context.storageState({ path: authFile });
          return;
        }
      } catch (error) {
        console.warn('Error with direct iframe interaction:', error.message);
      }
    }

    console.log('Attempting JavaScript approach for Google sign-in');
    const clicked = await page.evaluate(() => {
      const googleButtons = Array.from(document.querySelectorAll('iframe')).filter(
        (iframe) => iframe.src && iframe.src.includes('accounts.google.com/gsi')
      );
      if (googleButtons.length > 0) {
        googleButtons[0].click();
        return true;
      }
      return false;
    });

    if (clicked) {
      console.log('Clicked Google button via JavaScript');
      const popup = await context.waitForEvent('page', { timeout: 30000 }).catch(() => null);
      if (popup) {
        await handleGoogleAuth(popup);
        await page.waitForURL('**/manage', { timeout: 30000 });
        console.log('Saving authentication state');
        await context.storageState({ path: authFile });
        return;
      }
    }

    throw new Error('Failed to authenticate with Google');
  } catch (error) {
    console.error('Authentication error:', error.message);
    await page.screenshot({ path: path.join(screenshotsDir, 'auth-error.png') });
    throw error;
  }
}

module.exports = { login, authFile };