# Test info

- Name: SnapQuest Feature Tests >> TC-APP-SQ-001: Verify accessing "Join to events button" from plus icon in Joined Events page
- Location: C:\Users\Admin\Documents\format_test\liveshare\tests\snapquest.spec.js:29:3

# Error details

```
Error: Input field for event code should not be found

expect(received).toBeFalsy()

Received: true
    at C:\Users\Admin\Documents\format_test\liveshare\tests\snapquest.spec.js:109:82
```

# Page snapshot

```yaml
- button
- text: Create Your Event
- img
- text: Setup your event type, theme and name Select Your Event Type
- combobox:
  - option "Select Event Type" [disabled] [selected]
  - option "Wedding"
  - option "Birthday"
  - option "Baby Shower"
  - option "Anniversary"
  - option "Celebration"
  - option "Valentines"
  - option "Graduation"
  - option "Vacation"
- text: Enter Your Event Name
- textbox "Event Name": 95LZ85
- text: Enter Your Event Date
- textbox "Choose Event Date"
- textbox
- button "Next" [disabled]
```

# Test source

```ts
   9 | if (!fs.existsSync(screenshotsDir)) {
   10 |   fs.mkdirSync(screenshotsDir, { recursive: true });
   11 | }
   12 |
   13 | test.describe('SnapQuest Feature Tests', () => {
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
   29 |   test('TC-APP-SQ-001: Verify accessing "Join to events button" from plus icon in Joined Events page', async ({ page, context }) => {
   30 |     console.log('Starting test: TC-APP-SQ-001');
   31 |
   32 |     // Navigate to app and login
   33 |     console.log('Navigating to app and logging in...');
   34 |     await page.goto('https://app.livesharenow.com/');
   35 |     const success = await loginPage.completeGoogleAuth(context);
   36 |     expect(success, 'Google authentication should be successful').toBeTruthy();
   37 |     
   38 |     // Navigate to Joined Events tab
   39 |     console.log('Clicking on Joined Events tab...');
   40 |     const joinedEventsTab = page.locator('div.mat-tab-label:has-text("Joined Events")');
   41 |     await joinedEventsTab.waitFor({ state: 'visible', timeout: 10000 });
   42 |     await joinedEventsTab.click();
   43 |     await page.waitForTimeout(2000);
   44 |     await page.screenshot({ path: path.join(screenshotsDir, 'joined-events-tab.png') });
   45 |     
   46 |     // Look for join button
   47 |     // Note: Based on the test case description, we expect this to fail as the functionality might not exist
   48 |     console.log('Looking for join button...');
   49 |     const joinButtonSelectors = [
   50 |       'button:has-text("Join")',
   51 |       'button:has-text("Join Event")',
   52 |       'button:has(mat-icon:text("add"))',
   53 |       '.Create-Event',
   54 |       'button.btn-circle.btn-lg',
   55 |       'button:has(i.material-icons:text("add"))'
   56 |     ];
   57 |     
   58 |     let joinButtonFound = false;
   59 |     for (const selector of joinButtonSelectors) {
   60 |       const joinButton = page.locator(selector).first();
   61 |       if (await joinButton.isVisible().catch(() => false)) {
   62 |         console.log(`Found join button with selector: ${selector}`);
   63 |         await joinButton.click();
   64 |         joinButtonFound = true;
   65 |         
   66 |         // Wait for potential join dialog
   67 |         await page.waitForTimeout(2000);
   68 |         await page.screenshot({ path: path.join(screenshotsDir, 'join-dialog.png') });
   69 |         
   70 |         // Look for input field to enter code
   71 |         const codeInputSelectors = [
   72 |           'input[placeholder*="code" i]',
   73 |           'input[placeholder*="ID" i]',
   74 |           'input[placeholder*="Unique ID" i]',
   75 |           'input.input-bordered'
   76 |         ];
   77 |         
   78 |         let codeInputFound = false;
   79 |         for (const inputSelector of codeInputSelectors) {
   80 |           const codeInput = page.locator(inputSelector).first();
   81 |           if (await codeInput.isVisible().catch(() => false)) {
   82 |             console.log(`Found code input with selector: ${inputSelector}`);
   83 |             await codeInput.fill(eventCodes[0]);
   84 |             codeInputFound = true;
   85 |             
   86 |             // Look for confirm/join button
   87 |             const confirmButtonSelectors = [
   88 |               'button:has-text("Join")',
   89 |               'button:has-text("Join An Event")',
   90 |               'button:has-text("Submit")',
   91 |               'button:has-text("Confirm")'
   92 |             ];
   93 |             
   94 |             for (const buttonSelector of confirmButtonSelectors) {
   95 |               const confirmButton = page.locator(buttonSelector).first();
   96 |               if (await confirmButton.isEnabled().catch(() => false)) {
   97 |                 console.log(`Found confirm button with selector: ${buttonSelector}`);
   98 |                 await confirmButton.click();
   99 |                 await page.waitForTimeout(5000);
  100 |                 await page.screenshot({ path: path.join(screenshotsDir, 'after-join-attempt.png') });
  101 |                 break;
  102 |               }
  103 |             }
  104 |             break;
  105 |           }
  106 |         }
  107 |         
  108 |         // We expect this to not be found based on test case expected result
> 109 |         expect(codeInputFound, 'Input field for event code should not be found').toBeFalsy();
      |                                                                                  ^ Error: Input field for event code should not be found
  110 |         break;
  111 |       }
  112 |     }
  113 |     
  114 |     // We expect this to fail as the functionality might not exist
  115 |     expect(joinButtonFound, 'Join button should not be found in Joined Events tab').toBeFalsy();
  116 |     
  117 |     // Take a screenshot of the current state for debugging
  118 |     await page.screenshot({ path: path.join(screenshotsDir, 'joined-events-no-join-button.png') });
  119 |     
  120 |     console.log('TC-APP-SQ-001 completed with expected warning: Join button not found');
  121 |   });
  122 |
  123 |   test('TC-APP-SQ-002: Verify accessing "Join" button in nondashboard website', async ({ page, context }) => {
  124 |     console.log('Starting test: TC-APP-SQ-002');
  125 |
  126 |     // Navigate directly to the non-dashboard URL
  127 |     console.log('Navigating to nondashboard URL...');
  128 |     await page.goto('https://app.livesharenow.com/?brand=null');
  129 |     await page.waitForTimeout(2000);
  130 |     await page.screenshot({ path: path.join(screenshotsDir, 'non-dashboard-landing.png') });
  131 |     
  132 |     // Look for Join button
  133 |     console.log('Looking for Join button...');
  134 |     const joinButtonSelectors = [
  135 |       'button.color-blue',
  136 |       'span.btn-text:has-text("Join")',
  137 |       'div.bottom-div button',
  138 |       'button:has-text("Join")'
  139 |     ];
  140 |     
  141 |     let joinButtonFound = false;
  142 |     for (const selector of joinButtonSelectors) {
  143 |       const joinButton = page.locator(selector).first();
  144 |       if (await joinButton.isVisible().catch(() => false)) {
  145 |         console.log(`Found join button with selector: ${selector}`);
  146 |         
  147 |         // Take screenshot before clicking
  148 |         await page.screenshot({ path: path.join(screenshotsDir, 'before-join-click.png') });
  149 |         
  150 |         try {
  151 |           // Try force click option first
  152 |           await joinButton.click({ force: true, timeout: 5000 });
  153 |         } catch (error) {
  154 |           console.log('Force click failed, trying JavaScript click...');
  155 |           // If that fails, try JavaScript click method directly on the element
  156 |           await page.evaluate(selector => {
  157 |             // Use document.querySelector for simplicity
  158 |             const button = document.querySelector(selector);
  159 |             if (button) {
  160 |               button.dispatchEvent(new MouseEvent('click', {
  161 |                 bubbles: true,
  162 |                 cancelable: true,
  163 |                 view: window
  164 |               }));
  165 |               return true;
  166 |             }
  167 |             return false;
  168 |           }, selector);
  169 |         }
  170 |         
  171 |         joinButtonFound = true;
  172 |         await page.waitForTimeout(2000);
  173 |         await page.screenshot({ path: path.join(screenshotsDir, 'join-dialog-nondashboard.png') });
  174 |         break;
  175 |       }
  176 |     }
  177 |     
  178 |     expect(joinButtonFound, 'Join button should be found in non-dashboard page').toBeTruthy();
  179 |     
  180 |     // Look for input field to enter code
  181 |     console.log('Looking for code input field...');
  182 |     const codeInputSelectors = [
  183 |       'input.inputLogin',
  184 |       'input[placeholder*="Unique ID"]',
  185 |       'input[placeholder*="code" i]',
  186 |       'input[placeholder*="ID" i]',
  187 |       'input.input-bordered'
  188 |     ];
  189 |     
  190 |     let codeInputFound = false;
  191 |     for (const inputSelector of codeInputSelectors) {
  192 |       const codeInput = page.locator(inputSelector).first();
  193 |       if (await codeInput.isVisible().catch(() => false)) {
  194 |         console.log(`Found code input with selector: ${inputSelector}`);
  195 |         
  196 |         // Clear first in case there's any default value
  197 |         await codeInput.clear();
  198 |         await page.waitForTimeout(500);
  199 |         
  200 |         // Fill the event code
  201 |         await codeInput.fill(eventCodes[0]);
  202 |         codeInputFound = true;
  203 |         
  204 |         // Take screenshot after entering code
  205 |         await page.screenshot({ path: path.join(screenshotsDir, 'code-entered.png') });
  206 |         
  207 |         // Look for confirm/join button
  208 |         console.log('Looking for join confirmation button...');
  209 |         const confirmButtonSelectors = [
```