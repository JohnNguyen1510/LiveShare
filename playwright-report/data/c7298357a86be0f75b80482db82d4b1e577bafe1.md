# Test info

- Name: SnapQuest Additional Feature Tests >> TC-APP-FSQ-007: Verify "Airshow Home" Button Functionality
- Location: C:\Users\Admin\Documents\format_test\liveshare\tests\snapquest-features.spec.js:140:3

# Error details

```
Error: Google authentication should be successful

expect(received).toBeTruthy()

Received: false
    at C:\Users\Admin\Documents\format_test\liveshare\tests\snapquest-features.spec.js:147:67
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
   47 |   }
   48 |
   49 |   test('TC-APP-FSQ-006: Verify "Details" button functionality', async ({ page, context }) => {
   50 |     console.log('Starting test: TC-APP-FSQ-006');
   51 |     
   52 |     // Navigate to app and login
   53 |     console.log('Navigating to app and logging in...');
   54 |     await page.goto('https://app.livesharenow.com/');
   55 |     const success = await loginPage.completeGoogleAuth(context);
   56 |     expect(success, 'Google authentication should be successful').toBeTruthy();
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
> 147 |     expect(success, 'Google authentication should be successful').toBeTruthy();
      |                                                                   ^ Error: Google authentication should be successful
  148 |     
  149 |     // Navigate to joined event
  150 |     const hasEvents = await navigateToJoinedEvent(page);
  151 |     if (!hasEvents) {
  152 |       console.log('No joined events found, skipping test');
  153 |       test.skip();
  154 |       return;
  155 |     }
  156 |     
  157 |     // Look for Airshow Home button
  158 |     console.log('Looking for Airshow Home button...');
  159 |     const airshowHomeButtonSelectors = [
  160 |       'a.menu-button1:has-text("Airshow Home")',
  161 |       'a[href*="defendersoflibertyairshow.com"]',
  162 |       'a.d-flex:has-text("Airshow Home")'
  163 |     ];
  164 |     
  165 |     let buttonFound = false;
  166 |     for (const selector of airshowHomeButtonSelectors) {
  167 |       const button = page.locator(selector).first();
  168 |       if (await button.isVisible().catch(() => false)) {
  169 |         console.log(`Found Airshow Home button with selector: ${selector}`);
  170 |         
  171 |         // Get button properties
  172 |         const buttonText = await button.textContent();
  173 |         const buttonHref = await button.getAttribute('href');
  174 |         const buttonTarget = await button.getAttribute('target');
  175 |         
  176 |         console.log(`Button text: "${buttonText}", href: ${buttonHref}, target: ${buttonTarget}`);
  177 |         
  178 |         // Verify it has correct URL and opens in new tab
  179 |         expect(buttonHref).toContain('defendersoflibertyairshow.com');
  180 |         expect(buttonTarget).toBe('_blank');
  181 |         
  182 |         // Take screenshot for evidence
  183 |         await page.screenshot({ path: path.join(screenshotsDir, 'airshow-home-button.png') });
  184 |         
  185 |         buttonFound = true;
  186 |         break;
  187 |       }
  188 |     }
  189 |     
  190 |     expect(buttonFound, 'Airshow Home button should be found').toBeTruthy();
  191 |     
  192 |     console.log('TC-APP-FSQ-007 completed successfully');
  193 |   });
  194 |
  195 |   test('TC-APP-FSQ-008: Verify "Map" Button Functionality', async ({ page, context }) => {
  196 |     console.log('Starting test: TC-APP-FSQ-008');
  197 |     
  198 |     // Navigate to app and login
  199 |     console.log('Navigating to app and logging in...');
  200 |     await page.goto('https://app.livesharenow.com/');
  201 |     const success = await loginPage.completeGoogleAuth(context);
  202 |     expect(success, 'Google authentication should be successful').toBeTruthy();
  203 |     
  204 |     // Navigate to joined event
  205 |     const hasEvents = await navigateToJoinedEvent(page);
  206 |     if (!hasEvents) {
  207 |       console.log('No joined events found, skipping test');
  208 |       test.skip();
  209 |       return;
  210 |     }
  211 |     
  212 |     // Look for Map button
  213 |     console.log('Looking for Map button...');
  214 |     const mapButtonSelectors = [
  215 |       'a.menu-button2:has-text("Map")',
  216 |       'a[href*="barksdale.af.mil"]',
  217 |       'a.d-flex:has-text("Map")'
  218 |     ];
  219 |     
  220 |     let buttonFound = false;
  221 |     for (const selector of mapButtonSelectors) {
  222 |       const button = page.locator(selector).first();
  223 |       if (await button.isVisible().catch(() => false)) {
  224 |         console.log(`Found Map button with selector: ${selector}`);
  225 |         
  226 |         // Get button properties
  227 |         const buttonText = await button.textContent();
  228 |         const buttonHref = await button.getAttribute('href');
  229 |         const buttonTarget = await button.getAttribute('target');
  230 |         
  231 |         console.log(`Button text: "${buttonText}", href: ${buttonHref}, target: ${buttonTarget}`);
  232 |         
  233 |         // Verify it has correct URL and opens in new tab
  234 |         expect(buttonHref).toContain('barksdale.af.mil');
  235 |         expect(buttonTarget).toBe('_blank');
  236 |         
  237 |         // Take screenshot for evidence
  238 |         await page.screenshot({ path: path.join(screenshotsDir, 'map-button.png') });
  239 |         
  240 |         buttonFound = true;
  241 |         break;
  242 |       }
  243 |     }
  244 |     
  245 |     expect(buttonFound, 'Map button should be found').toBeTruthy();
  246 |     
  247 |     console.log('TC-APP-FSQ-008 completed successfully');
```