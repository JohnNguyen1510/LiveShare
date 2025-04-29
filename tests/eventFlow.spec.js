import { expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
import { test } from './fixtures/eventFixtures.js';
import { navigateToTuanEvent } from './helpers/navigation.js';
import { renameEventAndVerify } from './helpers/settings.js';

// Create screenshots directory if it doesn't exist
const screenshotsDir = path.join(__dirname, '..', 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Main test file with sequential execution
test.describe.serial('Event flow', () => {
  // Step 1: Enable settings
  test('Enable settings for event', async ({ page, context, savedEventUrl }) => {
    // Set long timeout for this complex setup
    test.setTimeout(180000);
    
    // Go to main application and navigate to the event page
    await page.goto('https://app.livesharenow.com/');
    console.log('Starting event settings configuration...');
    
    // Navigate to the events page and select first event
    const eventUrl = await navigateToTuanEvent(page, screenshotsDir);
    
    // Store the event URL for direct navigation in later tests
    test.info().annotations.push({
      type: 'savedEventUrl',
      description: eventUrl
    });
    
    // Save URL to worker-level fixture for other tests to use
    savedEventUrl = eventUrl; 
    
    // Update settings
    await renameEventAndVerify(page, screenshotsDir);
  });
  
  // Step 2: Test event details (only runs after settings are enabled)
  test('TC-APP-DEEV-01: Check name of event after settings', async ({ page, savedEventUrl }) => {
    console.log('Starting event name verification test');
    
    // Navigate directly to the event page
    if (savedEventUrl) {
      console.log(`Navigating to saved event URL: ${savedEventUrl}`);
      await page.goto(savedEventUrl, { timeout: 30000 });
    } else {
      console.log('No saved URL, navigating to events page');
      await navigateToTuanEvent(page, screenshotsDir);
    }
    
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(screenshotsDir, 'event-name-verification.png') });
    
    // Check event name
    const eventNameElement = page.locator('.event-name-event, .event-name').first();
    await expect(eventNameElement).toBeVisible();
    
    const eventNameText = await eventNameElement.textContent();
    expect(eventNameText.trim()).toContain('tuanhay');
    
    console.log(`Event name verified: "${eventNameText.trim()}"`);
  });
  
  test('TC-APP-DEEV-02: Check event date after settings', async ({ page, savedEventUrl }) => {
    console.log('Starting event date verification test');
    
    // Navigate directly to the event page
    if (savedEventUrl) {
      console.log(`Navigating to saved event URL: ${savedEventUrl}`);
      await page.goto(savedEventUrl, { timeout: 30000 });
    } else {
      console.log('No saved URL, navigating to events page');
      await navigateToTuanEvent(page, screenshotsDir);
    }
    
    await page.waitForTimeout(3000);
    
    // Click more options menu
    const moreVertIcon = page.locator('mat-icon.material-icons:text("more_vert")');
    await moreVertIcon.click({ force: true });
    await page.waitForTimeout(1000);
    
    // Click Details option
    const detailsOption = page.locator('button mat-menu-item:has-text("Details"), span:has-text("Details")').first();
    await detailsOption.click({ force: true });
    
    // Take screenshot
    await page.screenshot({ path: path.join(screenshotsDir, 'event-date-dialog.png') });
    
    // Verify date
    const eventDateRow = page.locator('tr', { hasText: 'Event Date' });
    const eventDateCell = eventDateRow.locator('td').first();
    
    await expect(eventDateCell).toBeVisible();
    const eventDateText = await eventDateCell.textContent();
    
    console.log(`Event date verified: "${eventDateText.trim()}"`);
    expect(eventDateText.trim()).toBeTruthy();
    expect(eventDateText).toMatch(/\w+\s\d+,\s\d{4}/);
  });
  
  // TC-APP-DEEV-04: Check event features
  test('TC-APP-DEEV-04-A: Verify event header photo', async ({ page, savedEventUrl }) => {
    // Navigate directly to the event page
    if (savedEventUrl) {
      await page.goto(savedEventUrl, { timeout: 30000 });
    } else {
      await navigateToTuanEvent(page, screenshotsDir);
    }
    
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(screenshotsDir, 'event-header-photo.png') });
    
    // Verify header photo
    const eventImageContainer = page.locator('.event-image');
    await expect(eventImageContainer).toBeVisible();
    
    const headerImage = eventImageContainer.locator('img').first();
    await expect(headerImage).toBeVisible();
    
    const imageSrc = await headerImage.getAttribute('src');
    expect(imageSrc).toBeTruthy();
    
    console.log(`Header image verified with source: "${imageSrc}"`);
  });
  
  test('TC-APP-DEEV-04-B: Verify event location data', async ({ page, savedEventUrl }) => {
    // Navigate directly to the event page
    if (savedEventUrl) {
      await page.goto(savedEventUrl, { timeout: 30000 });
    } else {
      await navigateToTuanEvent(page, screenshotsDir);
    }
    
    await page.waitForTimeout(3000);
    
    // Expand details panel if needed
    const detailsPanel = page.locator('mat-expansion-panel-header:has-text("Details")');
    
    const isPanelExpanded = await page.evaluate(() => {
      const panel = document.querySelector('mat-expansion-panel');
      return panel && panel.classList.contains('mat-expanded');
    });
    
    if (!isPanelExpanded) {
      await detailsPanel.click({ force: true });
      await page.waitForTimeout(1000);
    }
    
    await page.screenshot({ path: path.join(screenshotsDir, 'event-location.png') });
    
    // Verify location
    const locationRow = page.locator('.flex.items-start:has(mat-icon:text("location_on"))');
    await expect(locationRow).toBeVisible();
    
    const locationText = await locationRow.locator('.text-sm').textContent();
    console.log(`Location verified: "${locationText.trim()}"`);
    
    expect(locationText.trim()).toBeTruthy();
  });
  
  test('TC-APP-DEEV-04-C: Verify contact information', async ({ page, savedEventUrl }) => {
    // Navigate directly to the event page
    if (savedEventUrl) {
      await page.goto(savedEventUrl, { timeout: 30000 });
    } else {
      await navigateToTuanEvent(page, screenshotsDir);
    }
    
    await page.waitForTimeout(3000);
    
    // Expand details panel if needed
    const detailsPanel = page.locator('mat-expansion-panel-header:has-text("Details")');
    
    const isPanelExpanded = await page.evaluate(() => {
      const panel = document.querySelector('mat-expansion-panel');
      return panel && panel.classList.contains('mat-expanded');
    });
    
    if (!isPanelExpanded) {
      await detailsPanel.click({ force: true });
      await page.waitForTimeout(1000);
    }
    
    await page.screenshot({ path: path.join(screenshotsDir, 'event-contact.png') });
    
    // Verify contact info
    const contactRow = page.locator('.flex.items-start:has(mat-icon:text("phone"))');
    await expect(contactRow).toBeVisible();
    
    const contactText = await contactRow.locator('.text-sm').textContent();
    console.log(`Contact info verified: "${contactText.trim()}"`);
    
    expect(contactText.trim()).toBeTruthy();
  });
  
  test('TC-APP-DEEV-04-D: Verify picture functionality', async ({ page, savedEventUrl }) => {
    // Navigate directly to the event page
    if (savedEventUrl) {
      await page.goto(savedEventUrl, { timeout: 30000 });
    } else {
      await navigateToTuanEvent(page, screenshotsDir);
    }
    
    await page.waitForTimeout(3000);
    
    // Find and click first image
    const firstImage = page.locator('.image-wrapper.photo img.views').first();
    await page.screenshot({ path: path.join(screenshotsDir, 'before-image-click.png') });
    
    await expect(firstImage).toBeVisible();
    await firstImage.click({ force: true });
    
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(screenshotsDir, 'after-image-click.png') });
    
    // Check image viewer features
    const interactionButtons = page.locator('button.interaction-btn, mat-icon');
    const buttonCount = await interactionButtons.count();
    console.log(`Found ${buttonCount} interaction buttons in image viewer`);
    
    // Close viewer
    const closeButton = page.locator('mat-icon:text("close"), button.close-btn');
    
    if (await closeButton.isVisible()) {
      await closeButton.click({ force: true });
    } else {
      await page.keyboard.press('Escape');
    }
    
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(screenshotsDir, 'after-closing-image.png') });
  });
  
  test('TC-APP-DEEV-04-E: Verify button links', async ({ page, savedEventUrl }) => {
    // Navigate directly to the event page
    if (savedEventUrl) {
      await page.goto(savedEventUrl, { timeout: 30000 });
    } else {
      await navigateToTuanEvent(page, screenshotsDir);
    }
    
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(screenshotsDir, 'button-links.png') });
    
    // Check button links
    const buttonLink1 = page.locator('a.menu-button1, a.d-flex.menu-button1');
    await expect(buttonLink1).toBeVisible();
    
    const buttonLink2 = page.locator('a.menu-button2, a.d-flex.menu-button2');
    await expect(buttonLink2).toBeVisible();
    
    // Verify button link 1
    const buttonLink1Text = await buttonLink1.textContent();
    const buttonLink1Href = await buttonLink1.getAttribute('href');
    
    console.log(`Button Link #1 text: "${buttonLink1Text.trim()}", href: "${buttonLink1Href}"`);
    expect(buttonLink1Text.trim()).toContain('tuanhay');
    expect(buttonLink1Href).toContain('localhost.com');
    
    // Verify button link 2
    const buttonLink2Text = await buttonLink2.textContent();
    const buttonLink2Href = await buttonLink2.getAttribute('href');
    
    console.log(`Button Link #2 text: "${buttonLink2Text.trim()}", href: "${buttonLink2Href}"`);
    expect(buttonLink2Text.trim()).toContain('tuanhay');
    expect(buttonLink2Href).toContain('localhost.com');
  });
}); 