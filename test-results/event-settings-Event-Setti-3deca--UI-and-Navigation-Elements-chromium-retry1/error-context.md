# Test info

- Name: Event Settings & UI Verification Tests >> TC-APP-EVENT-001-008: Verify Event Page UI and Navigation Elements
- Location: C:\Users\Admin\Documents\format_test\liveshare\tests\event-settings.spec.js:26:3

# Error details

```
Error: Gift an Event option should be visible

expect(received).toBeTruthy()

Received: false
    at C:\Users\Admin\Documents\format_test\liveshare\tests\event-settings.spec.js:218:72
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
  118 |         
  119 |         try {
  120 |           // Try clicking the menu button
  121 |           await menuButton.click();
  122 |           menuButtonFound = true;
  123 |         } catch (error) {
  124 |           console.log(`Error clicking with selector ${selector}: ${error.message}`);
  125 |           // Try clicking the parent element instead
  126 |           try {
  127 |             const parentButton = page.locator(`${selector}/..`).first();
  128 |             await parentButton.click();
  129 |             menuButtonFound = true;
  130 |           } catch (parentError) {
  131 |             console.log(`Error clicking parent: ${parentError.message}`);
  132 |           }
  133 |         }
  134 |         
  135 |         if (menuButtonFound) {
  136 |           // Take screenshot after successful click
  137 |           await page.waitForTimeout(1000);
  138 |           await page.screenshot({ path: path.join(screenshotsDir, 'after-menu-click.png') });
  139 |           break;
  140 |         }
  141 |       }
  142 |     }
  143 |     
  144 |     // If still not found, try using JavaScript with more specific selectors
  145 |     if (!menuButtonFound) {
  146 |       console.log('Trying JavaScript approach to click menu button');
  147 |       menuButtonFound = await page.evaluate(() => {
  148 |         // Try multiple approaches
  149 |         // 1. Try direct class-based selector
  150 |         let menuTrigger = document.querySelector('div.mat-menu-trigger');
  151 |         if (menuTrigger) {
  152 |           // Use dispatchEvent instead of direct click
  153 |           menuTrigger.dispatchEvent(new MouseEvent('click', {
  154 |             bubbles: true,
  155 |             cancelable: true,
  156 |             view: window
  157 |           }));
  158 |           return true;
  159 |         }
  160 |         
  161 |         // 2. Try finding by mat-icon content
  162 |         const menuIcons = Array.from(document.querySelectorAll('mat-icon'));
  163 |         for (const icon of menuIcons) {
  164 |           if (icon.textContent.trim() === 'menu') {
  165 |             // Click the icon or its parent if it's in a button
  166 |             const button = icon.closest('div.mat-menu-trigger') || icon.closest('button') || icon;
  167 |             // Use dispatchEvent instead of click for better compatibility
  168 |             button.dispatchEvent(new MouseEvent('click', {
  169 |               bubbles: true,
  170 |               cancelable: true,
  171 |               view: window
  172 |             }));
  173 |             return true;
  174 |           }
  175 |         }
  176 |         
  177 |         // 3. Try dropmenu1 class
  178 |         const dropmenu = document.querySelector('.dropmenu1 div[aria-haspopup="menu"]');
  179 |         if (dropmenu) {
  180 |           // Use dispatchEvent instead of direct click
  181 |           dropmenu.dispatchEvent(new MouseEvent('click', {
  182 |             bubbles: true,
  183 |             cancelable: true,
  184 |             view: window
  185 |           }));
  186 |           return true;
  187 |         }
  188 |         
  189 |         return false;
  190 |       });
  191 |       
  192 |       console.log(`JavaScript click menu button result: ${menuButtonFound}`);
  193 |       await page.waitForTimeout(1000);
  194 |       await page.screenshot({ path: path.join(screenshotsDir, 'js-menu-click.png') });
  195 |     }
  196 |     
  197 |     // Wait for menu to appear and verify it's visible
  198 |     console.log('Waiting for menu to appear...');
  199 |     const menuPanel = page.locator('.mat-menu-panel, .cdk-overlay-pane').first();
  200 |     await menuPanel.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
  201 |     const isMenuVisible = await menuPanel.isVisible().catch(() => false);
  202 |     
  203 |     if (!isMenuVisible) {
  204 |       console.log('Menu panel not visible, trying to click menu button again');
  205 |       // Try one more direct approach
  206 |       await page.locator('div.dropmenu1 div[aria-haspopup="menu"]').first().click({force: true}).catch(() => {});
  207 |       await page.waitForTimeout(1000);
  208 |     }
  209 |     
  210 |     await page.screenshot({ path: path.join(screenshotsDir, 'menu-panel.png') });
  211 |     
  212 |     // Try to find Gift an Event option with improved selector
  213 |     console.log('Looking for Gift an Event option...');
  214 |     const giftEventOption = page.locator('button:has-text("Gift an Event"), div:has-text("Gift an Event"):not(:has(button)), .mat-menu-content button:has(mat-icon:text("redeem"))').first();
  215 |     await giftEventOption.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
  216 |     const giftEventVisible = await giftEventOption.isVisible().catch(() => false);
  217 |     
> 218 |     expect(giftEventVisible, 'Gift an Event option should be visible').toBeTruthy();
      |                                                                        ^ Error: Gift an Event option should be visible
  219 |     
  220 |     // Take screenshot before clicking Gift an Event
  221 |     await page.screenshot({ path: path.join(screenshotsDir, 'gift-event-option.png') });
  222 |     
  223 |     // Click the Gift an Event option
  224 |     await giftEventOption.click().catch(async (error) => {
  225 |       console.log(`Error clicking Gift an Event: ${error.message}`);
  226 |       // Try JavaScript click as fallback
  227 |       await page.evaluate(() => {
  228 |         const giftButton = Array.from(document.querySelectorAll('button, div[role="menuitem"]'))
  229 |           .find(el => el.textContent.includes('Gift an Event'));
  230 |         if (giftButton) {
  231 |           // Use dispatchEvent instead of click
  232 |           giftButton.dispatchEvent(new MouseEvent('click', {
  233 |             bubbles: true,
  234 |             cancelable: true,
  235 |             view: window
  236 |           }));
  237 |         }
  238 |       });
  239 |     });
  240 |     await page.waitForTimeout(1000);
  241 |     
  242 |     // Verify sub-menu appears
  243 |     console.log('Verifying Gift Event submenu appears...');
  244 |     const giftSubMenu = page.locator('button:has-text("Create Gift Event"), button:has-text("View Gift Events")').first();
  245 |     await giftSubMenu.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
  246 |     const isSubMenuVisible = await giftSubMenu.isVisible().catch(() => false);
  247 |     
  248 |     expect(isSubMenuVisible, 'Gift Event submenu should appear').toBeTruthy();
  249 |     await page.screenshot({ path: path.join(screenshotsDir, 'gift-event-submenu.png') });
  250 |     
  251 |     // TC-APP-EVENT-005: Verify and click "Share Feedback"
  252 |     console.log('TC-APP-EVENT-005: Verifying Share Feedback functionality');
  253 |     await page.goto('https://app.livesharenow.com/');
  254 |     
  255 |     // Click menu button more reliably
  256 |     await page.locator('div.mat-menu-trigger, .dropmenu1 div[aria-haspopup="menu"], mat-icon:text("menu")').first().click({timeout: 5000}).catch(async () => {
  257 |       // Fallback to JavaScript click
  258 |       await page.evaluate(() => {
  259 |         const menuButton = document.querySelector('div.mat-menu-trigger') || 
  260 |                           document.querySelector('.dropmenu1 div[aria-haspopup="menu"]');
  261 |         if (menuButton) {
  262 |           // Use dispatchEvent instead of click
  263 |           menuButton.dispatchEvent(new MouseEvent('click', {
  264 |             bubbles: true,
  265 |             cancelable: true,
  266 |             view: window
  267 |           }));
  268 |         }
  269 |       });
  270 |     });
  271 |     
  272 |     await page.waitForTimeout(1000);
  273 |     await page.screenshot({ path: path.join(screenshotsDir, 'menu-opened-feedback.png') });
  274 |     
  275 |     const shareFeedbackOption = page.locator('button:has-text("Share Feedback"), button:has(mat-icon:text("rate_review"))').first();
  276 |     await shareFeedbackOption.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
  277 |     const feedbackVisible = await shareFeedbackOption.isVisible().catch(() => false);
  278 |     
  279 |     expect(feedbackVisible, 'Share Feedback option should be visible').toBeTruthy();
  280 |     await page.screenshot({ path: path.join(screenshotsDir, 'share-feedback-option.png') });
  281 |     
  282 |     // Click Share Feedback for more thorough testing
  283 |     await shareFeedbackOption.click().catch(async (error) => {
  284 |       console.log(`Error clicking Share Feedback: ${error.message}`);
  285 |       // Try JavaScript click as fallback
  286 |       await page.evaluate(() => {
  287 |         const feedbackButton = Array.from(document.querySelectorAll('button'))
  288 |           .find(el => el.textContent.includes('Share Feedback'));
  289 |         if (feedbackButton) {
  290 |           // Use dispatchEvent instead of click
  291 |           feedbackButton.dispatchEvent(new MouseEvent('click', {
  292 |             bubbles: true,
  293 |             cancelable: true,
  294 |             view: window
  295 |           }));
  296 |         }
  297 |       });
  298 |     });
  299 |     
  300 |     await page.waitForTimeout(1000);
  301 |     await page.screenshot({ path: path.join(screenshotsDir, 'after-feedback-click.png') });
  302 |     
  303 |     // TC-APP-EVENT-006: Verify "Gift an Event" again (duplicate of TC-APP-EVENT-004, but keeping for completeness)
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
```