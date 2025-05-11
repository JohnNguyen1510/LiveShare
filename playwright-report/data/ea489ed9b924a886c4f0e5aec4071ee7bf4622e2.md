# Test info

- Name: Event Settings & UI Verification Tests >> TC-APP-CUST-001-018: Verify Event Settings Customization
- Location: C:\Users\Admin\Documents\format_test\liveshare\tests\event-settings.spec.js:397:3

# Error details

```
Error: Google authentication should be successful

expect(received).toBeTruthy()

Received: false
    at C:\Users\Admin\Documents\format_test\liveshare\tests\event-settings.spec.js:404:67
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
  304 |     console.log('TC-APP-EVENT-006: Verifying Gift an Event again (duplicate test)');
  305 |     // Already covered in TC-APP-EVENT-004
  306 |     
  307 |     // TC-APP-EVENT-007: Verify Share button
  308 |     console.log('TC-APP-EVENT-007: Verifying Share button');
  309 |     // Navigate back to event detail page
  310 |     await eventPage.navigateToEvents();
  311 |     await eventPage.clickFirstEvent();
  312 |     await page.waitForTimeout(2000);
  313 |     
  314 |     const shareButton = page.locator('button:has(mat-icon:text("share")), button.btn-circle.btn-ghost:has(mat-icon:text("share"))').first();
  315 |     const shareButtonVisible = await shareButton.isVisible().catch(() => false);
  316 |     
  317 |     expect(shareButtonVisible, 'Share button should be visible').toBeTruthy();
  318 |     await page.screenshot({ path: path.join(screenshotsDir, 'share-button.png') });
  319 |     
  320 |     // Click Share button for more thorough testing
  321 |     await shareButton.click().catch(async (error) => {
  322 |       console.log(`Error clicking Share button: ${error.message}`);
  323 |       // Try JavaScript click as fallback
  324 |       await page.evaluate(() => {
  325 |         const shareBtn = Array.from(document.querySelectorAll('button'))
  326 |           .find(el => el.querySelector('mat-icon') && 
  327 |                 el.querySelector('mat-icon').textContent.includes('share'));
  328 |         if (shareBtn) {
  329 |           // Use dispatchEvent instead of click
  330 |           shareBtn.dispatchEvent(new MouseEvent('click', {
  331 |             bubbles: true,
  332 |             cancelable: true,
  333 |             view: window
  334 |           }));
  335 |         }
  336 |       });
  337 |     });
  338 |     
  339 |     await page.waitForTimeout(1000);
  340 |     await page.screenshot({ path: path.join(screenshotsDir, 'after-share-click.png') });
  341 |     
  342 |     // TC-APP-EVENT-008: Verify Help button
  343 |     console.log('TC-APP-EVENT-008: Verifying Help functionality');
  344 |     await page.goto('https://app.livesharenow.com/');
  345 |     
  346 |     // Click menu button more reliably
  347 |     await page.locator('div.mat-menu-trigger, .dropmenu1 div[aria-haspopup="menu"], mat-icon:text("menu")').first().click({timeout: 5000}).catch(async () => {
  348 |       // Fallback to JavaScript click
  349 |       await page.evaluate(() => {
  350 |         const menuButton = document.querySelector('div.mat-menu-trigger') || 
  351 |                           document.querySelector('.dropmenu1 div[aria-haspopup="menu"]');
  352 |         if (menuButton) {
  353 |           // Use dispatchEvent instead of click
  354 |           menuButton.dispatchEvent(new MouseEvent('click', {
  355 |             bubbles: true,
  356 |             cancelable: true,
  357 |             view: window
  358 |           }));
  359 |         }
  360 |       });
  361 |     });
  362 |     
  363 |     await page.waitForTimeout(1000);
  364 |     await page.screenshot({ path: path.join(screenshotsDir, 'menu-opened-help.png') });
  365 |     
  366 |     const helpOption = page.locator('button:has-text("Help"), button:has(a:has-text("Help")), button:has(mat-icon:text("help_outline"))').first();
  367 |     await helpOption.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
  368 |     const helpVisible = await helpOption.isVisible().catch(() => false);
  369 |     
  370 |     expect(helpVisible, 'Help option should be visible').toBeTruthy();
  371 |     await page.screenshot({ path: path.join(screenshotsDir, 'help-option.png') });
  372 |     
  373 |     // Click Help for more thorough testing
  374 |     await helpOption.click().catch(async (error) => {
  375 |       console.log(`Error clicking Help: ${error.message}`);
  376 |       // Try JavaScript click as fallback
  377 |       await page.evaluate(() => {
  378 |         // Look for the Help link or button
  379 |         const helpBtn = Array.from(document.querySelectorAll('button, a'))
  380 |           .find(el => el.textContent.includes('Help') || 
  381 |                 (el.querySelector('div') && el.querySelector('div').textContent.includes('Help')));
  382 |         if (helpBtn) {
  383 |           // Use dispatchEvent instead of click
  384 |           helpBtn.dispatchEvent(new MouseEvent('click', {
  385 |             bubbles: true,
  386 |             cancelable: true,
  387 |             view: window
  388 |           }));
  389 |         }
  390 |       });
  391 |     });
  392 |     
  393 |     await page.waitForTimeout(2000);
  394 |     await page.screenshot({ path: path.join(screenshotsDir, 'after-help-click.png') });
  395 |   });
  396 |
  397 |   test('TC-APP-CUST-001-018: Verify Event Settings Customization', async ({ page, context }) => {
  398 |     console.log('Starting test: TC-APP-CUST-001-018');
  399 |     
  400 |     // Navigate to app and login
  401 |     console.log('Navigating to app and logging in...');
  402 |     await page.goto('https://app.livesharenow.com/');
  403 |     const success = await loginPage.completeGoogleAuth(context);
> 404 |     expect(success, 'Google authentication should be successful').toBeTruthy();
      |                                                                   ^ Error: Google authentication should be successful
  405 |     
  406 |     // Navigate to events and select first event
  407 |     console.log('Navigating to events page...');
  408 |     await eventPage.navigateToEvents();
  409 |     
  410 |     console.log('Selecting first event...');
  411 |     await eventPage.clickFirstEvent();
  412 |     
  413 |     console.log('Opening event settings...');
  414 |     await eventPage.openSettings();
  415 |     await page.screenshot({ path: path.join(screenshotsDir, 'event-settings-opened.png') });
  416 |
  417 |     // TC-APP-CUST-001: Verify Event Name field
  418 |     console.log('TC-APP-CUST-001: Verifying Event Name field');
  419 |     await eventPage.updateEventName('tuanhay');
  420 |     await page.screenshot({ path: path.join(screenshotsDir, 'event-name-updated.png') });
  421 |
  422 |     // TC-APP-CUST-002: Verify Event Date field
  423 |     console.log('TC-APP-CUST-002: Verifying Event Date field');
  424 |     // Locate and check Event Date field exists
  425 |     const eventDateOption = page.locator('.options:has-text("Event Date")');
  426 |     expect(await eventDateOption.isVisible(), 'Event Date option should be visible').toBeTruthy();
  427 |     await page.screenshot({ path: path.join(screenshotsDir, 'event-date-option.png') });
  428 |
  429 |     // TC-APP-CUST-003: Verify Enable Photo Gifts
  430 |     console.log('TC-APP-CUST-003: Verifying Enable Photo Gifts');
  431 |     const photoGiftOption = page.locator('.options:has-text("Enable Photo Gifts")');
  432 |     expect(await photoGiftOption.isVisible(), 'Photo Gift option should be visible').toBeTruthy();
  433 |     await page.screenshot({ path: path.join(screenshotsDir, 'photo-gift-option.png') });
  434 |
  435 |     // TC-APP-CUST-004: Verify Event Header Photo
  436 |     console.log('TC-APP-CUST-004: Verifying Event Header Photo functionality');
  437 |     await eventPage.updateHeaderPhoto();
  438 |     await page.screenshot({ path: path.join(screenshotsDir, 'header-photo-updated.png') });
  439 |
  440 |     // TC-APP-CUST-005: Verify Location, Contact, Itinerary fields
  441 |     console.log('TC-APP-CUST-005: Verifying Location, Contact, Itinerary fields');
  442 |     
  443 |     // Check Location field exists
  444 |     const locationOption = page.locator('.options:has-text("Location")');
  445 |     expect(await locationOption.isVisible(), 'Location option should be visible').toBeTruthy();
  446 |     
  447 |     // Check Contact field exists
  448 |     const contactOption = page.locator('.options:has-text("Contact")');
  449 |     expect(await contactOption.isVisible(), 'Contact option should be visible').toBeTruthy();
  450 |     
  451 |     // Check Itinerary field exists
  452 |     const itineraryOption = page.locator('.options:has-text("Itinerary")');
  453 |     expect(await itineraryOption.isVisible(), 'Itinerary option should be visible').toBeTruthy();
  454 |     
  455 |     await page.screenshot({ path: path.join(screenshotsDir, 'location-contact-itinerary.png') });
  456 |
  457 |     // TC-APP-CUST-006: Verify Enable Message Post
  458 |     console.log('TC-APP-CUST-006: Verifying Enable Message Post');
  459 |     const messagePostOption = page.locator('.options:has-text("Enable Message Post")');
  460 |     expect(await messagePostOption.isVisible(), 'Message Post option should be visible').toBeTruthy();
  461 |     await page.screenshot({ path: path.join(screenshotsDir, 'message-post-option.png') });
  462 |
  463 |     // TC-APP-CUST-007: Verify Popularity
  464 |     console.log('TC-APP-CUST-007: Verifying Popularity');
  465 |     const popularityOption = page.locator('.options:has-text("Popularity Badges")');
  466 |     expect(await popularityOption.isVisible(), 'Popularity option should be visible').toBeTruthy();
  467 |     await page.screenshot({ path: path.join(screenshotsDir, 'popularity-option.png') });
  468 |
  469 |     // TC-APP-CUST-008: Verify Video
  470 |     console.log('TC-APP-CUST-008: Verifying Video');
  471 |     const videoOption = page.locator('.options:has-text("Video")');
  472 |     expect(await videoOption.isVisible(), 'Video option should be visible').toBeTruthy();
  473 |     await page.screenshot({ path: path.join(screenshotsDir, 'video-option.png') });
  474 |
  475 |     // TC-APP-CUST-009: Verify Welcome Popup
  476 |     console.log('TC-APP-CUST-009: Verifying Welcome Popup');
  477 |     const welcomePopupOption = page.locator('.options:has-text("Welcome Popup")');
  478 |     expect(await welcomePopupOption.isVisible(), 'Welcome Popup option should be visible').toBeTruthy();
  479 |     await page.screenshot({ path: path.join(screenshotsDir, 'welcome-popup-option.png') });
  480 |
  481 |     // TC-APP-CUST-010: Verify Allow Guest Download
  482 |     console.log('TC-APP-CUST-010: Verifying Allow Guest Download');
  483 |     const guestDownloadOption = page.locator('.options:has-text("Allow Guest Download")');
  484 |     expect(await guestDownloadOption.isVisible(), 'Allow Guest Download option should be visible').toBeTruthy();
  485 |     await page.screenshot({ path: path.join(screenshotsDir, 'guest-download-option.png') });
  486 |
  487 |     // TC-APP-CUST-011: Verify Allow posting without login
  488 |     console.log('TC-APP-CUST-011: Verifying Allow posting without login');
  489 |     const postingWithoutLoginOption = page.locator('.options:has-text("Allow posting without login")');
  490 |     expect(await postingWithoutLoginOption.isVisible(), 'Allow posting without login option should be visible').toBeTruthy();
  491 |     await page.screenshot({ path: path.join(screenshotsDir, 'posting-without-login-option.png') });
  492 |
  493 |     // TC-APP-CUST-012: Verify Require Access Passcode
  494 |     console.log('TC-APP-CUST-012: Verifying Require Access Passcode');
  495 |     await eventPage.updateAccessCode('123');
  496 |     await page.screenshot({ path: path.join(screenshotsDir, 'access-code-updated.png') });
  497 |
  498 |     // TC-APP-CUST-013: Verify Add Event Managers
  499 |     console.log('TC-APP-CUST-013: Verifying Add Event Managers');
  500 |     await eventPage.updateEventManagers('nguyentrananhtuan@gmail.com');
  501 |     await page.screenshot({ path: path.join(screenshotsDir, 'event-managers-updated.png') });
  502 |
  503 |     // TC-APP-CUST-014: Verify Button Link #1
  504 |     console.log('TC-APP-CUST-014: Verifying Button Link #1');
```