import { expect } from '@playwright/test';
import * as path from 'path';

/**
 * Helper function to handle Google authentication flow
 * @param {Page} popup - The popup window for Google sign-in
 * @param {string} screenshotsDir - Directory to save screenshots
 */
export async function handleGoogleAuth(popup, screenshotsDir) {
  // Wait for the popup to load
  await popup.waitForLoadState('networkidle', { timeout: 30000 });
  await popup.screenshot({ path: path.join(screenshotsDir, '4-google-popup.png') });
  
  // Use environment variables for credentials
  const email = process.env.GOOGLE_EMAIL || 'tuan.nguyen@datarealities.com';
  const password = process.env.GOOGLE_PASSWORD || 'tuant123456';
  
  // Handle auth flow with better error handling
  try {
    console.log('Filling Google credentials');
    
    // Look for email input field and fill it
    const emailInput = popup.locator('input[type="email"]');
    await emailInput.waitFor({ state: 'visible', timeout: 10000 });
    await emailInput.fill(email);
    await popup.screenshot({ path: path.join(screenshotsDir, '4a-filled-email.png') });
    
    // Look for the next button and click it
    const nextButton = popup.getByRole('button', { name: /next/i });
    await nextButton.click({ force: true });
    
    // Wait for password field to appear
    await popup.waitForTimeout(3000);
    await popup.screenshot({ path: path.join(screenshotsDir, '4b-password-screen.png') });
    
    const passwordInput = popup.locator('input[type="password"]');
    await passwordInput.waitFor({ state: 'visible', timeout: 10000 });
    await passwordInput.fill(password);
    await popup.screenshot({ path: path.join(screenshotsDir, '4c-filled-password.png') });
    
    // Click next/sign in button
    await popup.getByRole('button', { name: /next|sign in/i }).click({ force: true });
    
    // Wait for the auth flow to complete
    await popup.waitForEvent('close', { timeout: 30000 }).catch(err => {
      console.warn('Google auth popup did not close as expected, continuing with test');
    });
    
    console.log('Google authentication completed');
  } catch (error) {
    console.error('Error during Google authentication:', error);
    await popup.screenshot({ path: path.join(screenshotsDir, 'auth-error.png') });
    throw error;
  }
}

/**
 * Performs login using Google authentication
 * @param {Page} page - Page object
 * @param {string} screenshotsDir - Directory to save screenshots 
 * @param {BrowserContext} context - Browser context
 * @param {string} authFile - Path to save authentication state
 * @returns {Promise<void>}
 */
export async function loginViaGoogle(page, screenshotsDir, context, authFile) {
  await page.goto('https://app.livesharenow.com/');
  await page.screenshot({ path: path.join(screenshotsDir, 'start-page.png') });
  
  // Log in via Google
  const signInButton = page.getByRole('button', { name: /sign in/i });
  await expect(signInButton).toBeVisible({ timeout: 10000 });
  await signInButton.click();
  
  // Wait for auth modal
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(screenshotsDir, 'auth-modal.png') });
  
  console.log('Starting Google authentication process...');
  
  // Google auth logic
  try {
    // Wait for iframes to load
    await page.waitForTimeout(5000);
    
    // Find Google iframe
    const frames = page.frames();
    console.log(`Found ${frames.length} frames`);
    
    const iframeUrls = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('iframe'))
        .map(iframe => iframe.src);
    });
    console.log('Found iframes:', iframeUrls);
    
    // Find Google Sign-In iframe
    let googleFrame = null;
    for (const frame of frames) {
      if (frame.url().includes('accounts.google.com/gsi')) {
        googleFrame = frame;
        console.log('Found Google GSI iframe');
        break;
      }
    }
    
    // First Google auth approach: Direct iframe interaction
    if (googleFrame) {
      await page.waitForTimeout(2000);
      
      try {
        const buttonLocator = googleFrame.locator('div[role="button"]');
        const isButtonVisible = await buttonLocator.isVisible();
        
        if (isButtonVisible) {
          console.log('Clicking Google sign-in button in iframe');
          
          const [popup] = await Promise.all([
            context.waitForEvent('page', { timeout: 30000 }),
            buttonLocator.click({ force: true, timeout: 15000 })
          ]);
          
          await handleGoogleAuth(popup, screenshotsDir);
          await page.waitForURL('**/manage', { timeout: 30000 });
          
          // Save auth state for future tests
          console.log('Saving authentication state');
          await context.storageState({ path: authFile });
          return true;
        }
      } catch (error) {
        console.warn('Error with direct iframe interaction:', error.message);
      }
    }
    
    // Second Google auth approach: JavaScript click
    console.log('Attempting JavaScript approach for Google sign-in');
    const clicked = await page.evaluate(() => {
      const googleButtons = Array.from(document.querySelectorAll('iframe'))
        .filter(iframe => iframe.src && iframe.src.includes('accounts.google.com/gsi'));
      
      if (googleButtons.length > 0) {
        googleButtons[0].click();
        return true;
      }
      
      return false;
    });
    
    if (clicked) {
      console.log('Clicked Google button via JavaScript');
      
      const popup = await context.waitForEvent('page', { timeout: 30000 }).catch(e => null);
      if (popup) {
        await handleGoogleAuth(popup, screenshotsDir);
        await page.waitForURL('**/manage', { timeout: 30000 });
        
        // Save auth state for future tests
        console.log('Saving authentication state');
        await context.storageState({ path: authFile });
        return true;
      }
    }
    
    throw new Error('Failed to authenticate with Google');
  } catch (error) {
    console.error('Authentication error:', error.message);
    await page.screenshot({ path: path.join(screenshotsDir, 'auth-error.png') });
    throw error;
  }
} 