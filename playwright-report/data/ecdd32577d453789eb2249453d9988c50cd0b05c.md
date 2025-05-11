# Test info

- Name: SnapQuest Additional Feature Tests >> TC-APP-FSQ-006: Verify "Details" button functionality
- Location: C:\Users\Admin\Documents\format_test\liveshare\tests\snapquest-features.spec.js:49:3

# Error details

```
Error: Google authentication should be successful

expect(received).toBeTruthy()

Received: false
    at C:\Users\Admin\Documents\format_test\liveshare\tests\snapquest-features.spec.js:56:67
```

# Page snapshot

```yaml
- text: Capture the moment & start LiveSharing NOW!
- button "Existing LiveShare User? Sign In"
- button "New to LiveShare? Create Free Account"
- text: Have an event code?
- button "Join"
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 | import { LoginPage } from '../page-objects/LoginPage.js';
   3 | import { EventPage } from '../page-objects/EventPage.js';
   4 | import path from 'path';
   5 | import fs from 'fs';
   6 |
   7 | // Create screenshots directory if it doesn't exist
   8 | const screenshotsDir = path.join(process.cwd(), 'screenshots');
   9 | if (!fs.existsSync(screenshotsDir)) {
   10 |   fs.mkdirSync(screenshotsDir, { recursive: true });
   11 | }
   12 |
   13 | test.describe('SnapQuest Additional Feature Tests', () => {
   14 |   // Increase timeout for the entire test suite
   15 |   test.setTimeout(240000);
   16 |   
   17 |   let loginPage;
   18 |   let eventPage;
   19 |   
   20 |   // Event codes for testing
   21 |   const eventCodes = ['95LZ85', '37FB49'];
   22 |
   23 |   test.beforeEach(async ({ page }) => {
   24 |     // Initialize page objects
   25 |     loginPage = new LoginPage(page);
   26 |     eventPage = new EventPage(page);
   27 |   });
   28 |
   29 |   // Helper function to navigate to a joined event
   30 |   async function navigateToJoinedEvent(page) {
   31 |     // Navigate to Joined Events tab
   32 |     console.log('Clicking on Joined Events tab...');
   33 |     const joinedEventsTab = page.locator('div.mat-tab-label:has-text("Joined Events")');
   34 |     await joinedEventsTab.waitFor({ state: 'visible', timeout: 10000 });
   35 |     await joinedEventsTab.click();
   36 |     await page.waitForTimeout(2000);
   37 |     
   38 |     // Select the first event
   39 |     console.log('Selecting first joined event...');
   40 |     const eventCards = page.locator('.event-card-event, .flex.pt-8, div.event-card, div.mat-card');
   41 |     if (await eventCards.count() > 0) {
   42 |       await eventCards.first().click();
   43 |       await page.waitForTimeout(3000);
   44 |       return true;
   45 |     }
   46 |     return false;
   47 |   }
   48 |
   49 |   test('TC-APP-FSQ-006: Verify "Details" button functionality', async ({ page, context }) => {
   50 |     console.log('Starting test: TC-APP-FSQ-006');
   51 |     
   52 |     // Navigate to app and login
   53 |     console.log('Navigating to app and logging in...');
   54 |     await page.goto('https://app.livesharenow.com/');
   55 |     const success = await loginPage.completeGoogleAuth(context);
>  56 |     expect(success, 'Google authentication should be successful').toBeTruthy();
      |                                                                   ^ Error: Google authentication should be successful
   57 |     
   58 |     // Navigate to joined event
   59 |     const hasEvents = await navigateToJoinedEvent(page);
   60 |     if (!hasEvents) {
   61 |       console.log('No joined events found, skipping test');
   62 |       test.skip();
   63 |       return;
   64 |     }
   65 |     
   66 |     // Take screenshot of event details
   67 |     await page.screenshot({ path: path.join(screenshotsDir, 'event-details-before.png') });
   68 |     
   69 |     // Look for Details panel
   70 |     console.log('Looking for Details panel...');
   71 |     const detailsPanelSelectors = [
   72 |       'mat-panel-title:has-text("Details")',
   73 |       '.eventdetailHeader',
   74 |       'mat-expansion-panel-header:has-text("Details")'
   75 |     ];
   76 |     
   77 |     let detailsPanelFound = false;
   78 |     for (const selector of detailsPanelSelectors) {
   79 |       const detailsPanel = page.locator(selector).first();
   80 |       if (await detailsPanel.isVisible().catch(() => false)) {
   81 |         console.log(`Found Details panel with selector: ${selector}`);
   82 |         
   83 |         // Check if already expanded
   84 |         const isExpanded = await page.locator('mat-expansion-panel.mat-expanded').count() > 0;
   85 |         if (!isExpanded) {
   86 |           // Click to expand
   87 |           await detailsPanel.click();
   88 |           await page.waitForTimeout(2000);
   89 |         }
   90 |         
   91 |         // Take screenshot after expanding
   92 |         await page.screenshot({ path: path.join(screenshotsDir, 'details-panel-expanded.png') });
   93 |         
   94 |         // Check for contact information
   95 |         const contactInfoSelectors = [
   96 |           '.flex.items-start:has(mat-icon:text("phone"))',
   97 |           '.text-sm.whitespace-pre-line:has-text("hello@snapquest.co")',
   98 |           'div:has-text("www.snapquest.co")'
   99 |         ];
  100 |         
  101 |         let contactInfoFound = false;
  102 |         for (const infoSelector of contactInfoSelectors) {
  103 |           if (await page.locator(infoSelector).first().isVisible().catch(() => false)) {
  104 |             console.log(`Found contact information with selector: ${infoSelector}`);
  105 |             contactInfoFound = true;
  106 |             break;
  107 |           }
  108 |         }
  109 |         
  110 |         expect(contactInfoFound, 'Contact information should be displayed').toBeTruthy();
  111 |         
  112 |         // Check for safety instructions or other details
  113 |         const safetyInfoSelectors = [
  114 |           '.flex.items-start:has(mat-icon:text("route"))',
  115 |           '.text-sm.whitespace-pre-line:has-text("LOST CHILD?")',
  116 |           'div:has-text("LOST CHILD?")'
  117 |         ];
  118 |         
  119 |         let safetyInfoFound = false;
  120 |         for (const infoSelector of safetyInfoSelectors) {
  121 |           if (await page.locator(infoSelector).first().isVisible().catch(() => false)) {
  122 |             console.log(`Found safety information with selector: ${infoSelector}`);
  123 |             safetyInfoFound = true;
  124 |             break;
  125 |           }
  126 |         }
  127 |         
  128 |         expect(safetyInfoFound, 'Safety information should be displayed').toBeTruthy();
  129 |         
  130 |         detailsPanelFound = true;
  131 |         break;
  132 |       }
  133 |     }
  134 |     
  135 |     expect(detailsPanelFound, 'Details panel should be found').toBeTruthy();
  136 |     
  137 |     console.log('TC-APP-FSQ-006 completed successfully');
  138 |   });
  139 |
  140 |   test('TC-APP-FSQ-007: Verify "Airshow Home" Button Functionality', async ({ page, context }) => {
  141 |     console.log('Starting test: TC-APP-FSQ-007');
  142 |     
  143 |     // Navigate to app and login
  144 |     console.log('Navigating to app and logging in...');
  145 |     await page.goto('https://app.livesharenow.com/');
  146 |     const success = await loginPage.completeGoogleAuth(context);
  147 |     expect(success, 'Google authentication should be successful').toBeTruthy();
  148 |     
  149 |     // Navigate to joined event
  150 |     const hasEvents = await navigateToJoinedEvent(page);
  151 |     if (!hasEvents) {
  152 |       console.log('No joined events found, skipping test');
  153 |       test.skip();
  154 |       return;
  155 |     }
  156 |     
```