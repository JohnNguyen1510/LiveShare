# Test info

- Name: Event Settings & UI Verification Tests >> TC-APP-VIEW-001-008: Verify Plus Features in View Detail
- Location: C:\Users\Admin\Documents\format_test\liveshare\tests\PlusIcon-event.spec.js:24:5

# Error details

```
Error: Google authentication should be successful

expect(received).toBeTruthy()

Received: false
    at C:\Users\Admin\Documents\format_test\liveshare\tests\PlusIcon-event.spec.js:31:71
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
   9 |     if (!fs.existsSync(screenshotsDir)) {
  10 |     fs.mkdirSync(screenshotsDir);
  11 |     }
  12 |
  13 | test.describe('Event Settings & UI Verification Tests', () => {
  14 |     test.setTimeout(240000);
  15 |     
  16 |     let loginPage;
  17 |     let eventPage;
  18 |
  19 |     test.beforeEach(async ({ page }) => {
  20 |         // Initialize page objects
  21 |         loginPage = new LoginPage(page);
  22 |         eventPage = new EventPage(page);
  23 |     });
  24 |     test('TC-APP-VIEW-001-008: Verify Plus Features in View Detail', async ({ page, context }) => {
  25 |         console.log('Starting test: TC-APP-VIEW-001-008');
  26 |         
  27 |         // Navigate to app and login
  28 |         console.log('Navigating to app and logging in...');
  29 |         await page.goto('https://app.livesharenow.com/');
  30 |         const success = await loginPage.completeGoogleAuth(context);
> 31 |         expect(success, 'Google authentication should be successful').toBeTruthy();
     |                                                                       ^ Error: Google authentication should be successful
  32 |         
  33 |         // Navigate to events and select first event
  34 |         console.log('Navigating to events page...');
  35 |         await eventPage.navigateToEvents();
  36 |         
  37 |         console.log('Selecting first event...');
  38 |         await eventPage.clickFirstEvent();
  39 |         await page.waitForTimeout(2000); // Give page time to fully load
  40 |         
  41 |         console.log('Clicking add button to reveal feature options...');
  42 |         const addButton = page.locator('button.menu-button, button:has(mat-icon:text("add"))').first();
  43 |         await addButton.waitFor({ state: 'visible', timeout: 5000 });
  44 |         await addButton.click();
  45 |         await page.waitForTimeout(2000); // Wait for menu to appear
  46 |         await page.screenshot({ path: path.join(screenshotsDir, 'feature-options.png') });
  47 |         
  48 |         // TC-APP-VIEW-001: Verify Then & Now button
  49 |         console.log('TC-APP-VIEW-001: Verifying Then & Now button');
  50 |         const thenAndNowButton = page.locator('button:has-text("Then & Now")').first();
  51 |         await thenAndNowButton.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
  52 |         const thenAndNowVisible = await thenAndNowButton.isVisible().catch(() => false);
  53 |         expect(thenAndNowVisible, 'Then & Now button should be visible').toBeTruthy();
  54 |         await page.screenshot({ path: path.join(screenshotsDir, 'then-and-now-button.png') });
  55 |         
  56 |         // TC-APP-VIEW-002: Verify KeepSake button
  57 |         console.log('TC-APP-VIEW-002: Verifying KeepSake button');
  58 |         const keepSakeButton = page.locator('button:has-text("KeepSake")');
  59 |         expect(await keepSakeButton.isVisible(), 'KeepSake button should be visible').toBeTruthy();
  60 |         await page.screenshot({ path: path.join(screenshotsDir, 'keepsake-button.png') });
  61 |         
  62 |         // TC-APP-VIEW-003: Verify Clue button
  63 |         console.log('TC-APP-VIEW-003: Verifying Clue button');
  64 |         const clueButton = page.locator('button:has-text("Clue")');
  65 |         expect(await clueButton.isVisible(), 'Clue button should be visible').toBeTruthy();
  66 |         await page.screenshot({ path: path.join(screenshotsDir, 'clue-button.png') });
  67 |         
  68 |         // TC-APP-VIEW-004: Verify Sponsor button
  69 |         console.log('TC-APP-VIEW-004: Verifying Sponsor button');
  70 |         const sponsorButton = page.locator('button:has-text("Sponsor")');
  71 |         expect(await sponsorButton.isVisible(), 'Sponsor button should be visible').toBeTruthy();
  72 |         await page.screenshot({ path: path.join(screenshotsDir, 'sponsor-button.png') });
  73 |         
  74 |         // TC-APP-VIEW-005: Verify Prize button
  75 |         console.log('TC-APP-VIEW-005: Verifying Prize button');
  76 |         const prizeButton = page.locator('button:has-text("Prize")');
  77 |         expect(await prizeButton.isVisible(), 'Prize button should be visible').toBeTruthy();
  78 |         await page.screenshot({ path: path.join(screenshotsDir, 'prize-button.png') });
  79 |         
  80 |         // TC-APP-VIEW-006: Verify Message button
  81 |         console.log('TC-APP-VIEW-006: Verifying Message button');
  82 |         const messageButton = page.locator('button:has-text("Message")');
  83 |         expect(await messageButton.isVisible(), 'Message button should be visible').toBeTruthy();
  84 |         await page.screenshot({ path: path.join(screenshotsDir, 'message-button.png') });
  85 |         
  86 |         // TC-APP-VIEW-007: Verify Photos button
  87 |         console.log('TC-APP-VIEW-007: Verifying Photos button');
  88 |         const photosButton = page.locator('button:has-text("Photos")');
  89 |         expect(await photosButton.isVisible(), 'Photos button should be visible').toBeTruthy();
  90 |         await page.screenshot({ path: path.join(screenshotsDir, 'photos-button.png') });
  91 |         
  92 |         // TC-APP-VIEW-008: Verify Videos button
  93 |         console.log('TC-APP-VIEW-008: Verifying Videos button');
  94 |         const videosButton = page.locator('button:has-text("Videos")');
  95 |         expect(await videosButton.isVisible(), 'Videos button should be visible').toBeTruthy();
  96 |         await page.screenshot({ path: path.join(screenshotsDir, 'videos-button.png') });
  97 |     });
  98 | });
```