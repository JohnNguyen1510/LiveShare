import * as path from 'path';

/**
 * Navigates to the events page and selects the first event
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} screenshotsDir - Directory to save screenshots
 * @returns {Promise<string>} The URL of the selected event
 */
export async function navigateToTuanEvent(page, screenshotsDir) {
  console.log('Navigating to events page...');
  
  // Wait for the manage to fully load
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(screenshotsDir, '6-before-events-navigation.png') });
  
  try {
    // Method 1: Navigate directly to events page
    console.log('Navigating directly to events page');
    await page.goto('https://app.livesharenow.com/events', { timeout: 30000 });
    await page.waitForTimeout(3000);
    
    // Verify we're on events page
    const currentUrl = page.url();
    if (!currentUrl.includes('/events')) {
      console.warn(`Expected to be on events page, but URL is ${currentUrl}`);
      
      // Try clicking on navigation as fallback
      console.log('Trying to navigate via menu');
      const eventsLink = page.locator('a[href*="events"], a:has-text("Events"), button:has-text("Events")').first();
      if (await eventsLink.isVisible()) {
        await eventsLink.click();
        await page.waitForURL('**/events', { timeout: 10000 });
      }
    }
    
    await page.screenshot({ path: path.join(screenshotsDir, '7-events-page.png') });
    
    // Wait for events to load
    await page.waitForTimeout(3000);
    
    // Look for event with text 'tuanhay'
    console.log('Looking for event "tuanhay"...');
    
    // First try to find specific event with "tuanhay" name
    const specificEvent = page.locator('.event-card:has-text("tuanhay"), .mat-card:has-text("tuanhay")').first();
    const specificEventVisible = await specificEvent.isVisible().catch(() => false);
    
    // If specific event found, click it
    if (specificEventVisible) {
      console.log('Found "tuanhay" event');
      await specificEvent.scrollIntoViewIfNeeded();
      await specificEvent.click({ force: true });
    } else {
      // Otherwise just take any first event
      console.log('Specific event not found, selecting first available event');
      const anyEvent = page.locator('.flex.pt-8, div.event-card, div.mat-card').first();
      if (await anyEvent.isVisible()) {
        console.log('Found an event to click');
        await anyEvent.scrollIntoViewIfNeeded();
        await page.screenshot({ path: path.join(screenshotsDir, '8-found-event.png') });
        
        // Click with force to bypass any overlay issues
        await anyEvent.click({ force: true });
      } else {
        throw new Error('Could not find any events to click');
      }
    }
    
    // Wait for event details page to load
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(screenshotsDir, '9-event-details.png') });
    
    console.log('Successfully navigated to event details page');
    return page.url();
  } catch (error) {
    console.error('Error navigating to events:', error);
    await page.screenshot({ path: path.join(screenshotsDir, 'error-events-navigation.png') });
    throw error;
  }
}