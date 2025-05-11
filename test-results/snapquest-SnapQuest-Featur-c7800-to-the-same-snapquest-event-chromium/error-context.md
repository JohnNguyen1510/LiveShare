# Test info

- Name: SnapQuest Feature Tests >> TC-APP-FSQ-005: Check user cant join into the same snapquest event
- Location: C:\Users\Admin\Documents\format_test\liveshare\tests\snapquest.spec.js:708:3

# Error details

```
Error: Event should appear only once in Joined Events

expect(received).toBe(expected) // Object.is equality

Expected: 1
Received: 2
    at C:\Users\Admin\Documents\format_test\liveshare\tests\snapquest.spec.js:802:78
```

# Page snapshot

```yaml
- link:
  - /url: ""
- text: EVENTS
- tablist:
  - tab "My Events"
  - tab "Joined Events" [selected]
- tabpanel "My Events"
- tabpanel "Joined Events":
  - button
  - text: 3/28/2025 Defenders of Liberty '25 95LZ85
  - button "PremiumPlus"
  - text: Hosted by SnapQuest
  - button
  - text: 3/28/2025 Defenders of Liberty 2025 37FB49
  - button "PremiumPlus"
  - text: Hosted by SnapQuest
  - button
  - text: 3/28/2025 Defenders of Liberty 2025 37FB49
  - button "PremiumPlus"
  - text: Hosted by SnapQuest
- button "add"
```

# Test source

```ts
  702 |       test.skip();
  703 |     }
  704 |     
  705 |     console.log('TC-APP-FSQ-003 & TC-APP-FSQ-004 completed successfully');
  706 |   });
  707 |
  708 |   test('TC-APP-FSQ-005: Check user cant join into the same snapquest event', async ({ page, context }) => {
  709 |     console.log('Starting test: TC-APP-FSQ-005');
  710 |     
  711 |     // Navigate directly to the non-dashboard URL
  712 |     console.log('Navigating to nondashboard URL...');
  713 |     await page.goto('https://app.livesharenow.com/?brand=null');
  714 |     await page.waitForTimeout(2000);
  715 |     
  716 |     // First join - Look for Join button
  717 |     console.log('First attempt: Looking for Join button...');
  718 |     const joinButton = page.locator('button:has-text("Join"), span.btn-text:has-text("Join")').first();
  719 |     await joinButton.waitFor({ state: 'visible', timeout: 10000 });
  720 |     await joinButton.click();
  721 |     await page.waitForTimeout(2000);
  722 |     
  723 |     // Enter event code
  724 |     console.log('Entering event code for first join...');
  725 |     const codeInput = page.locator('input[placeholder*="Unique ID"], input.inputLogin').first();
  726 |     await codeInput.waitFor({ state: 'visible', timeout: 5000 });
  727 |     await codeInput.fill(eventCodes[0]);
  728 |     
  729 |     // Look for join confirmation button
  730 |     console.log('Looking for join confirmation button...');
  731 |     const confirmButton = page.locator('button:has-text("Join An Event"), button.inputLogin').first();
  732 |     await confirmButton.waitFor({ state: 'visible', timeout: 5000 });
  733 |     if (await confirmButton.isEnabled()) {
  734 |       await confirmButton.click();
  735 |       await page.waitForTimeout(5000);
  736 |     }
  737 |     
  738 |     // Check if we're redirected to the event details page
  739 |     console.log('Verifying redirection to event details page...');
  740 |     await page.waitForSelector('.event-detail, .event-image, .event-name-event', { timeout: 10000 });
  741 |     
  742 |     // Go back to the join page for second attempt
  743 |     console.log('Second attempt: Navigating back to join page...');
  744 |     await page.goto('https://app.livesharenow.com/?brand=null');
  745 |     await page.waitForTimeout(2000);
  746 |     
  747 |     // Second join - Look for Join button
  748 |     console.log('Looking for Join button again...');
  749 |     const joinButton2 = page.locator('button:has-text("Join"), span.btn-text:has-text("Join")').first();
  750 |     await joinButton2.waitFor({ state: 'visible', timeout: 10000 });
  751 |     await joinButton2.click();
  752 |     await page.waitForTimeout(2000);
  753 |     
  754 |     // Enter the same event code
  755 |     console.log('Entering the same event code for second join...');
  756 |     const codeInput2 = page.locator('input[placeholder*="Unique ID"], input.inputLogin').first();
  757 |     await codeInput2.waitFor({ state: 'visible', timeout: 5000 });
  758 |     await codeInput2.fill(eventCodes[0]);
  759 |     
  760 |     // Look for join confirmation button
  761 |     console.log('Looking for join confirmation button...');
  762 |     const confirmButton2 = page.locator('button:has-text("Join An Event"), button.inputLogin').first();
  763 |     await confirmButton2.waitFor({ state: 'visible', timeout: 5000 });
  764 |     if (await confirmButton2.isEnabled()) {
  765 |       await confirmButton2.click();
  766 |       await page.waitForTimeout(5000);
  767 |     }
  768 |     
  769 |     // Navigate to app and login
  770 |     console.log('Navigating to app and logging in...');
  771 |     await page.goto('https://app.livesharenow.com/');
  772 |     const success = await loginPage.completeGoogleAuth(context);
  773 |     expect(success, 'Google authentication should be successful').toBeTruthy();
  774 |     
  775 |     // Navigate to Joined Events tab
  776 |     console.log('Clicking on Joined Events tab...');
  777 |     const joinedEventsTab = page.locator('div.mat-tab-label:has-text("Joined Events")');
  778 |     await joinedEventsTab.waitFor({ state: 'visible', timeout: 10000 });
  779 |     await joinedEventsTab.click();
  780 |     await page.waitForTimeout(2000);
  781 |     
  782 |     // Count the number of events with the code we joined
  783 |     console.log('Counting duplicated events...');
  784 |     
  785 |     // Method 1: Count events with the name visible
  786 |     const duplicateEvents = page.locator('.event-card-event:has-text("' + eventCodes[0] + '"), ' + 
  787 |                                '.event-card:has-text("' + eventCodes[0] + '"), ' +
  788 |                                '.flex.pt-8:has-text("' + eventCodes[0] + '")');
  789 |     const duplicateCount = await duplicateEvents.count();
  790 |     
  791 |     // Method 2: Count total events and compare before and after
  792 |     const allEvents = page.locator('.event-card-event, .event-card, .flex.pt-8');
  793 |     const totalCount = await allEvents.count();
  794 |     
  795 |     console.log(`Found ${duplicateCount} events with code ${eventCodes[0]} out of ${totalCount} total events`);
  796 |     
  797 |     // Take screenshot for evidence
  798 |     await page.screenshot({ path: path.join(screenshotsDir, 'joined-events-duplicate.png') });
  799 |     
  800 |     // This is expected to fail based on the test case information
  801 |     // "User store 2 event in the same code in joined Events page"
> 802 |     expect(duplicateCount, 'Event should appear only once in Joined Events').toBe(1);
      |                                                                              ^ Error: Event should appear only once in Joined Events
  803 |     
  804 |     console.log('TC-APP-FSQ-005 completed - Expected to fail');
  805 |   });
  806 | }); 
```