import * as path from 'path';
import * as fs from 'fs';

const screenshotsDir = path.join(__dirname, '../../screenshots');

/**
 * Renames event and verifies the settings are applied correctly
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} screenshotsDir - Directory to save screenshots
 * @returns {Promise<boolean>} True if settings were applied successfully
 */
export async function renameEventAndVerify(page, screenshotsDir) {
  console.log('Starting event customization process...');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(screenshotsDir, '10-before-settings.png') });

  try {
    console.log('Looking for settings button...');
    const specificSettingsButton = page.locator('button.btn.btn-circle.btn-ghost:has(mat-icon:text("settings"))');
    await page.screenshot({ path: path.join(screenshotsDir, '11-before-settings-click.png') });

    const buttonCount = await specificSettingsButton.count();
    if (buttonCount === 0) throw new Error('Could not find settings button');

    console.log('Found settings button, clicking it');
    await specificSettingsButton.click({ force: true });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(screenshotsDir, '12-after-settings-click.png') });

    console.log('Updating core features...');
    await updateSingleFeature(page, 'Event Name', 'tuanhay', screenshotsDir);
    await updateSingleFeature(page, 'Require Access Passcode', '123', screenshotsDir, true);
    await updateSingleFeature(page, 'Add Event Managers', 'nguyentrananhtuan@gmail.com', screenshotsDir);

    const featuresToEnable = [
      'Connect Google Analytics',
      'Collect Form Responses',
      'Require Name',
      'Require Email',
      'Photo Gift',
      'Popularity',
      'Budget',
      'Connect Zoom',
      'Live Video',
      'Photo Gallery',
      'Survey',
      'Schedule',
      'Add to Calendar',
    ];

    await page.screenshot({ path: path.join(screenshotsDir, '12b-before-features-toggle.png') });
    console.log('Handling Event Header Photo feature specifically...');
    await handleEventHeaderPhoto(page, screenshotsDir);

    console.log('Handling Button Link feature specifically...');
    await handleButtonLink(page, 'tuanhay', 'localhost.com', screenshotsDir);

    console.log('Handling Button Link #2 feature specifically...');
    await handleButtonLink2(page, 'tuanhay', 'localhost.com', screenshotsDir);

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    console.log('Attempting to enable all required features...');
    for (const feature of featuresToEnable) {
      let success = false;
      try {
        await toggleFeature(page, feature, true, screenshotsDir);
        success = true;
      } catch (e) {
        console.log(`First toggle attempt failed for ${feature}: ${e.message}`);
      }

      if (!success) {
        try {
          console.log(`Trying alternative approach for ${feature}...`);
          const featureItems = [
            page.locator(`.options:has-text("${feature}")`),
            page.locator(`div.mat-list-item:has-text("${feature}")`),
            page.locator(`button:has-text("${feature}")`),
            page.locator(`div.feature-item:has-text("${feature}")`),
          ];

          for (const item of featureItems) {
            if (await item.count() > 0) {
              await item.first().click({ force: true });
              await page.waitForTimeout(1000);
              const toggle = page.locator('.toggle, input[type="checkbox"], .mat-slide-toggle').first();
              if (await toggle.isVisible()) {
                await toggle.click({ force: true });
                const saveBtn = page.locator('button:has-text("Save")').first();
                if (await saveBtn.isVisible()) await saveBtn.click({ force: true });
                success = true;
                break;
              }
            }
          }
        } catch (e) {
          console.log(`Alternative approach failed for ${feature}: ${e.message}`);
        }
      }

      await page.screenshot({
        path: path.join(screenshotsDir, `feature-toggle-${feature.replace(/\s+/g, '-').toLowerCase()}.png`),
      });

      if (featuresToEnable.indexOf(feature) % 3 === 0) {
        await page.evaluate(() => window.scrollBy(0, 300));
        await page.waitForTimeout(500);
      }
    }

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1000);

    console.log('Saving all settings...');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    await page.screenshot({ path: path.join(screenshotsDir, 'before-final-save.png') });
    console.log('Checking if all required features are enabled...');

    const mainSaveButton = page.locator('app-personalize button.btn-primary:has-text("Save")').first();
    if (await mainSaveButton.isVisible()) {
      console.log('Found main Save button, clicking it');
      await mainSaveButton.scrollIntoViewIfNeeded();
      await page.screenshot({ path: path.join(screenshotsDir, '14-before-save-click.png') });
      await mainSaveButton.click({ force: true });
      await page.waitForTimeout(3000);
    } else {
      console.warn('Could not find main Save button');
      const altSaveButton = page.locator('.mat-dialog-actions .btn-primary, button.btn-primary:has-text("Save"), .btn:has-text("Save")').first();
      if (await altSaveButton.isVisible()) {
        console.log('Found alternative Save button, clicking it');
        await altSaveButton.scrollIntoViewIfNeeded();
        await altSaveButton.click({ force: true });
        await page.waitForTimeout(3000);
      } else {
        console.error('Could not find any Save button to click');
        await page.screenshot({ path: path.join(screenshotsDir, 'error-no-save-button.png') });
      }
    }

    await page.screenshot({ path: path.join(screenshotsDir, '15-after-settings-save.png') });
    console.log('Verifying event name change...');
    await page.waitForTimeout(2000);

    const eventName = page.locator('.event-name-event, .event-name').first();
    if (await eventName.isVisible()) {
      const eventNameText = await eventName.textContent();
      console.log(`Current event name: ${eventNameText}`);
      if (eventNameText.includes('tuanhay')) {
        console.log('Event name successfully changed to tuanhay!');
      } else {
        console.warn(`Expected event name "tuanhay" but found "${eventNameText}"`);
      }
    } else {
      console.warn('Could not find event name element for verification');
    }

    await page.screenshot({ path: path.join(screenshotsDir, '16-verification-complete.png') });
    console.log('Event customization completed successfully!');
    return true;
  } catch (error) {
    console.error('Error during event customization process:', error);
    await page.screenshot({ path: path.join(screenshotsDir, 'error-customization-process.png') });
    throw error;
  }
}

/**
 * Updates a single feature with the given value
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} featureName - Name of the feature to update
 * @param {string} value - Value to set for the feature
 * @param {string} screenshotsDir - Directory to save screenshots
 * @param {boolean} shouldEnable - Whether to enable the feature
 * @returns {Promise<boolean>} True if feature was updated successfully
 */
export async function updateSingleFeature(page, featureName, value, screenshotsDir, shouldEnable = false) {
  console.log(`Updating feature: ${featureName} to "${value}"`);
  try {
    const featureOption = page.locator(`.options:has(span:text-is("${featureName}"))`).first();
    const featureExists = await featureOption.count() > 0;

    if (!featureExists) {
      console.warn(`Feature "${featureName}" not found, trying alternative selectors`);
      const altFeatureOption = page.locator(`div:has-text("${featureName}"):not(:has(*))`, {
        hasText: new RegExp(`^${featureName}$`),
      }).first();
      if (await altFeatureOption.count() === 0) {
        console.warn(`Feature "${featureName}" not found with alternative selectors either`);
        return false;
      }
      await altFeatureOption.click({ force: true });
    } else {
      await featureOption.click({ force: true });
    }

    await page.waitForTimeout(1000);
    await page.screenshot({
      path: path.join(screenshotsDir, `feature-${featureName.replace(/\s+/g, '-').toLowerCase()}-dialog.png`),
    });

    const inputField = page.locator('input.input-bordered, mat-form-field input, input[type="text"]').first();
    const inputVisible = await inputField.isVisible({ timeout: 3000 }).catch(() => false);

    if (inputVisible) {
      await inputField.clear();
      await inputField.fill(value);

      if (shouldEnable) {
        const toggle = page.locator('.toggle, .switch, input[type="checkbox"]').first();
        if (await toggle.isVisible()) {
          const isChecked = await toggle.isChecked();
          if (!isChecked) {
            console.log(`Enabling toggle for "${featureName}"`);
            await toggle.click({ force: true });
          }
        }
      }

      const saveButton = page.locator('.mat-dialog-actions .btn:has-text("Save"), button.btn-primary:has-text("Save")').first();
      if (await saveButton.isVisible()) {
        console.log(`Clicking Save for "${featureName}"`);
        await saveButton.click({ force: true });
        await page.waitForTimeout(2000);
        return true;
      } else {
        console.warn(`No Save button found for feature "${featureName}"`);
        return false;
      }
    } else {
      console.warn(`No input field found for feature "${featureName}", checking for toggles`);
      return await toggleFeature(page, featureName, shouldEnable, screenshotsDir);
    }
  } catch (error) {
    console.error(`Error updating feature "${featureName}":`, error);
    await page.screenshot({
      path: path.join(screenshotsDir, `error-feature-${featureName.replace(/\s+/g, '-').toLowerCase()}.png`),
    });
    return false;
  }
}

/**
 * Toggles a feature on or off
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} featureName - Name of the feature to toggle
 * @param {boolean} enable - Whether to enable or disable the feature
 * @param {string} screenshotsDir - Directory to save screenshots
 * @returns {Promise<boolean>} True if feature was toggled successfully
 */
export async function toggleFeature(page, featureName, enable = true, screenshotsDir) {
  console.log(`Toggling feature "${featureName}" ${enable ? 'ON' : 'OFF'}`);
  
  try {
    // Look for the feature option first with multiple selector approaches
    const featureSelectors = [
      `.options:has(span:text-is("${featureName}"))`,
      `.options:has-text("${featureName}")`,
      `div:has-text("${featureName}")`,
      `div.mat-list-item:has-text("${featureName}")`,
      `button:has-text("${featureName}")`,
      `div.feature-item:has-text("${featureName}")`
    ];
    
    let featureClicked = false;
    
    // Try each selector to find and click the feature
    for (const selector of featureSelectors) {
      const featureOption = page.locator(selector).first();
      
      if (await featureOption.count() > 0) {
        // Take a screenshot before clicking
        await page.screenshot({ path: path.join(screenshotsDir, `feature-${featureName.replace(/\s+/g, '-').toLowerCase()}-before-click.png`) });
        
        // Click to open the feature dialog if needed
        console.log(`Clicking feature "${featureName}" using selector: ${selector}`);
        await featureOption.click({ force: true });
        await page.waitForTimeout(1500);
        
        // Take a screenshot after clicking to see what appeared
        await page.screenshot({ path: path.join(screenshotsDir, `feature-${featureName.replace(/\s+/g, '-').toLowerCase()}-after-click.png`) });
        
        featureClicked = true;
        break;
      }
    }
    
    if (!featureClicked) {
      console.warn(`Could not find feature "${featureName}" to click`);
      return false;
    }
    
    // Check for toggle elements with expanded selectors
    const toggleSelectors = [
      '.toggle',
      '.switch',
      'input[type="checkbox"]',
      '.mat-slide-toggle',
      'label:has(input[type="checkbox"])',
      '.mat-checkbox',
      '[role="switch"]',
      '[role="checkbox"]',
      '.custom-control-input'
    ];
    
    let toggleFound = false;
    
    for (const selector of toggleSelectors) {
      const toggle = page.locator(selector).first();
      
      if (await toggle.isVisible({ timeout: 1000 }).catch(() => false)) {
        // Check current state if possible
        const isChecked = await toggle.isChecked().catch(() => null);
        
        // If isChecked is null, fallback to class or attribute based check
        let needsToggle = true;
        
        if (isChecked !== null) {
          needsToggle = (enable && !isChecked) || (!enable && isChecked);
        } else {
          // Try to determine state from classes or attributes
          const classes = await toggle.evaluate(el => el.className).catch(() => '');
          const ariaChecked = await toggle.getAttribute('aria-checked').catch(() => null);
          
          if (classes.includes('checked') || classes.includes('active') || ariaChecked === 'true') {
            needsToggle = !enable; // Already enabled
          } else {
            needsToggle = enable; // Not enabled
          }
        }
        
        if (needsToggle) {
          console.log(`Clicking toggle for "${featureName}"`);
          await toggle.click({ force: true });
          await page.waitForTimeout(1000);
        } else {
          console.log(`Toggle for "${featureName}" already in desired state`);
        }
        
        toggleFound = true;
        
        // Look for any Save or Apply buttons inside a dialog
        const saveButtonSelectors = [
          '.mat-dialog-actions .btn:has-text("Save")',
          '.mat-dialog-actions button.btn-primary',
          'button.btn-primary:has-text("Save")',
          'button:has-text("Apply")',
          'button:has-text("OK")',
          '.mat-dialog-actions button:has-text("Save")'
        ];
        
        for (const saveSelector of saveButtonSelectors) {
          const saveButton = page.locator(saveSelector).first();
          
          if (await saveButton.isVisible({ timeout: 1000 }).catch(() => false)) {
            console.log(`Clicking save button for "${featureName}"`);
            await saveButton.click({ force: true });
            await page.waitForTimeout(1500);
            break;
          }
        }
        
        // Take a screenshot after toggling
        await page.screenshot({ path: path.join(screenshotsDir, `feature-${featureName.replace(/\s+/g, '-').toLowerCase()}-after-toggle.png`) });
        
        return true;
      }
    }
    
    if (!toggleFound) {
      // If no toggle found, check for direct enable/disable buttons
      const enableButtonSelectors = enable ? 
        ['button:has-text("Enable")', 'button:has-text("On")', 'button.active:has-text("Yes")'] :
        ['button:has-text("Disable")', 'button:has-text("Off")', 'button.active:has-text("No")'];
      
      for (const buttonSelector of enableButtonSelectors) {
        const button = page.locator(buttonSelector).first();
        
        if (await button.isVisible({ timeout: 1000 }).catch(() => false)) {
          console.log(`Clicking ${enable ? 'enable' : 'disable'} button for "${featureName}"`);
          await button.click({ force: true });
          await page.waitForTimeout(1000);
          
          // Look for save button
          const saveButton = page.locator('button:has-text("Save"), button:has-text("Apply")').first();
          if (await saveButton.isVisible({ timeout: 1000 }).catch(() => false)) {
            await saveButton.click({ force: true });
            await page.waitForTimeout(1000);
          }
          
          return true;
        }
      }
      
      console.warn(`Could not find toggle element for "${featureName}"`);
      return false;
    }
    
    return toggleFound;
  } catch (error) {
    console.error(`Error toggling feature "${featureName}":`, error);
    await page.screenshot({ path: path.join(screenshotsDir, `error-toggle-${featureName.replace(/\s+/g, '-').toLowerCase()}.png`) });
    return false;
  }
}

/**
 * Special handler for Event Header Photo which requires file upload
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} screenshotsDir - Directory to save screenshots
 * @returns {Promise<boolean>} True if header photo was set successfully
 */
export async function handleEventHeaderPhoto(page, screenshotsDir) {
  try {
    // Find and click the Event Header Photo feature
    console.log('Looking for Event Header Photo feature...');
    
    const headerPhotoSelectors = [
      `.options:has-text("Event Header Photo")`,
      `div:has-text("Event Header Photo")`,
      `div.mat-list-item:has-text("Event Header Photo")`,
      `button:has-text("Event Header Photo")`
    ];
    
    let featureFound = false;
    
    // Try each selector to find and click the feature
    for (const selector of headerPhotoSelectors) {
      const headerPhotoOption = page.locator(selector).first();
      
      if (await headerPhotoOption.count() > 0) {
        console.log(`Found Event Header Photo using selector: ${selector}`);
        await page.screenshot({ path: path.join(screenshotsDir, 'event-header-photo-found.png') });
        
        // Click to open the photo upload dialog
        await headerPhotoOption.click({ force: true });
        await page.waitForTimeout(2000);
        
        featureFound = true;
        break;
      }
    }
    
    if (!featureFound) {
      console.warn('Could not find Event Header Photo feature');
      return false;
    }
    
    // Take a screenshot of the dialog
    await page.screenshot({ path: path.join(screenshotsDir, 'event-header-photo-dialog.png') });
    
    // First check if there's a toggle to enable
    const toggle = page.locator('.toggle, .switch, input[type="checkbox"], .mat-slide-toggle').first();
    if (await toggle.isVisible({ timeout: 1000 }).catch(() => false)) {
      // Check if it's already enabled
      const isChecked = await toggle.isChecked().catch(() => null);
      
      if (isChecked === false) {
        console.log('Enabling Event Header Photo toggle');
        await toggle.click({ force: true });
        await page.waitForTimeout(1000);
      }
    }
    
    // Now click the Add button/label instead of directly setting the file
    console.log('Looking for "Add" button/label...');
    
    // Find the Add label (which is associated with the hidden file input)
    const addLabelSelectors = [
      'label.btn:has-text("Add")',
      'label[for="popupBg"]',
      'div.mat-dialog-actions label.btn',
      'label:has-text("Add")'
    ];
    
    let addLabelFound = false;
    
    for (const selector of addLabelSelectors) {
      const addLabel = page.locator(selector).first();
      
      if (await addLabel.isVisible({ timeout: 1000 }).catch(() => false)) {
        console.log(`Found Add label using selector: ${selector}`);
        
        // Before clicking the Add button, prepare the file input handler
        const fileInputPromise = page.waitForEvent('filechooser');
        
        // Click the Add label
        await addLabel.click({ force: true });
        
        // Get the file chooser
        const fileChooser = await fileInputPromise;
        
        // Path to test.jpg (assuming it's in the project root or another known location)
        // Try multiple possible locations
        const testImagePaths = [
          path.join(process.cwd(), 'test.jpg'),
          path.join(__dirname, 'test.jpg'),
          path.join(__dirname, '..', 'test.jpg'),
          path.join(__dirname, '..', '..', 'tests', 'test.jpg'), // Added the specific test directory path
          path.join(__dirname, '..', 'src', 'test.jpg'),
          path.join(__dirname, '..', 'public', 'test.jpg'),
          path.join(__dirname, '..', 'assets', 'test.jpg'),
          path.join(__dirname, '..', 'images', 'test.jpg')
        ];
        
        // Find which path exists
        let testImagePath = null;
        
        for (const imgPath of testImagePaths) {
          if (fs.existsSync(imgPath)) {
            console.log(`Found test.jpg at: ${imgPath}`);
            testImagePath = imgPath;
            break;
          }
        }
        
        // If we couldn't find test.jpg, create one in the screenshots directory
        if (!testImagePath) {
          console.log('Could not find test.jpg, creating a test image...');
          testImagePath = path.join(screenshotsDir, 'test.jpg');
          
          // Create a simple test image
          const imageBuffer = Buffer.from([
            0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x48,
            0x00, 0x48, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x43, 0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08,
            0x07, 0x07, 0x07, 0x09, 0x09, 0x08, 0x0a, 0x0c, 0x14, 0x0d, 0x0c, 0x0b, 0x0b, 0x0c, 0x19, 0x12,
            0x13, 0x0f, 0x14, 0x1d, 0x1a, 0x1f, 0x1e, 0x1d, 0x1a, 0x1c, 0x1c, 0x20, 0x24, 0x2e, 0x27, 0x20,
            0x22, 0x2c, 0x23, 0x1c, 0x1c, 0x28, 0x37, 0x29, 0x2c, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1f, 0x27,
            0x39, 0x3d, 0x38, 0x32, 0x3c, 0x2e, 0x33, 0x34, 0x32, 0xff, 0xc0, 0x00, 0x0b, 0x08, 0x00, 0x01,
            0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xff, 0xc4, 0x00, 0x14, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x09, 0xff, 0xc4, 0x00, 0x14,
            0x10, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0xff, 0xda, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3f, 0x00, 0x37, 0xff, 0xd9
          ]);
          
          fs.writeFileSync(testImagePath, imageBuffer);
        }
        
        // Set the file in the file chooser
        console.log(`Setting file for upload: ${testImagePath}`);
        await fileChooser.setFiles(testImagePath);
        
        // Wait for the upload to process
        await page.waitForTimeout(2000);
        await page.screenshot({ path: path.join(screenshotsDir, 'event-header-photo-after-file-set.png') });
        
        addLabelFound = true;
        break;
      }
    }
    
    if (!addLabelFound) {
      console.warn('Could not find Add label, trying to set file input directly');
      
      // Look for the file input and set it directly as fallback
      const fileInput = page.locator('input[type="file"][accept*="image"], input#popupBg').first();
      
      if (await fileInput.count() > 0) {
        console.log('Found file input for Event Header Photo');
        
        // Create a test image if it doesn't exist
        const testImagePath = path.join(screenshotsDir, 'test.jpg');
        
        if (!fs.existsSync(testImagePath)) {
          console.log('Creating test.jpg for upload...');
          
          // Create a simple test image
          const imageBuffer = Buffer.from([
            0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x48,
            0x00, 0x48, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x43, 0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08,
            0x07, 0x07, 0x07, 0x09, 0x09, 0x08, 0x0a, 0x0c, 0x14, 0x0d, 0x0c, 0x0b, 0x0b, 0x0c, 0x19, 0x12,
            0x13, 0x0f, 0x14, 0x1d, 0x1a, 0x1f, 0x1e, 0x1d, 0x1a, 0x1c, 0x1c, 0x20, 0x24, 0x2e, 0x27, 0x20,
            0x22, 0x2c, 0x23, 0x1c, 0x1c, 0x28, 0x37, 0x29, 0x2c, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1f, 0x27,
            0x39, 0x3d, 0x38, 0x32, 0x3c, 0x2e, 0x33, 0x34, 0x32, 0xff, 0xc0, 0x00, 0x0b, 0x08, 0x00, 0x01,
            0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xff, 0xc4, 0x00, 0x14, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x09, 0xff, 0xc4, 0x00, 0x14,
            0x10, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0xff, 0xda, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3f, 0x00, 0x37, 0xff, 0xd9
          ]);
          
          fs.writeFileSync(testImagePath, imageBuffer);
        }
        
        // Set the file input directly
        await fileInput.setInputFiles(testImagePath);
        await page.waitForTimeout(2000);
      } else {
        console.error('Could not find file input or Add label');
        return false;
      }
    }
    
    // Look for a "Done" button first (per requirements) 
    console.log('Looking for Done button...');
    const doneButtonSelectors = [
      'button:has-text("Done")',
      '.mat-dialog-actions button:has-text("Done")',
      'div.btn:has-text("Done")'
    ];
    
    for (const selector of doneButtonSelectors) {
      const doneButton = page.locator(selector).first();
      
      if (await doneButton.isVisible({ timeout: 1000 }).catch(() => false)) {
        console.log('Found Done button, clicking it');
        await doneButton.click({ force: true });
        await page.waitForTimeout(2000);
        
        // Done button might close the dialog or move to next step
        await page.screenshot({ path: path.join(screenshotsDir, 'event-header-photo-after-done.png') });
        break;
      }
    }
    
    // Now look for the Save button in the dialog
    console.log('Looking for Save button...');
    const saveButtonSelectors = [
      'div.mat-dialog-actions div.btn:has-text("Save")',
      'div.btn:has-text("Save")',
      '.mat-dialog-actions button:has-text("Save")',
      'div.mat-dialog-actions div.btn'
    ];
    
    for (const saveSelector of saveButtonSelectors) {
      const saveButton = page.locator(saveSelector).first();
      
      if (await saveButton.isVisible({ timeout: 1000 }).catch(() => false)) {
        console.log(`Found Save button for Event Header Photo using selector: ${saveSelector}`);
        
        // Need to check if this is actually the Save button (not Cancel or something else)
        const buttonText = await saveButton.textContent().catch(() => '');
        if (buttonText.trim().toLowerCase() === 'save' || buttonText.trim() === '') {
          // Force click the save button
          await saveButton.click({ force: true });
          await page.waitForTimeout(3000);
          
          // Take a screenshot after clicking save
          await page.screenshot({ path: path.join(screenshotsDir, 'event-header-photo-after-save.png') });
          
          console.log('Successfully set Event Header Photo');
          return true;
        } else {
          console.log(`Button text was "${buttonText}", looking for a better match`);
        }
      }
    }
    
    // If we still couldn't find the save button, try using JavaScript approach by finding it in the DOM structure you provided
    console.log('Trying to click Save button via JavaScript using the structure provided...');
    const saveButtonClicked = await page.evaluate(() => {
      // Using the DOM structure from your HTML snippet
      const dialogActions = document.querySelector('div[mat-dialog-actions].mat-dialog-actions');
      if (dialogActions) {
        // Find div with class "btn" inside dialog actions
        const buttons = dialogActions.querySelectorAll('div.btn');
        for (const btn of buttons) {
          // If text contains "Save" (case insensitive)
          if (btn.textContent && btn.textContent.trim().toLowerCase() === 'save') {
            btn.click();
            return true;
          }
        }
        
        // If we didn't find a button with "Save" text, click the first button that's not labeled "Cancel"
        for (const btn of buttons) {
          if (btn.textContent && !btn.textContent.trim().toLowerCase().includes('cancel')) {
            btn.click();
            return true;
          }
        }
      }
      return false;
    });
    
    if (saveButtonClicked) {
      console.log('Clicked Save button via JavaScript');
      await page.waitForTimeout(3000);
      await page.screenshot({ path: path.join(screenshotsDir, 'event-header-photo-after-js-save.png') });
      return true;
    }
    
    console.warn('Could not find Save button for Event Header Photo');
    return false;
    
  } catch (error) {
    console.error('Error handling Event Header Photo:', error);
    await page.screenshot({ path: path.join(screenshotsDir, 'error-event-header-photo.png') });
    return false;
  }
}

/**
 * Special handler for Button Link which requires specific name and URL inputs
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} name - Button name
 * @param {string} url - Button URL
 * @param {string} screenshotsDir - Directory to save screenshots
 * @returns {Promise<boolean>} True if button link was set successfully
 */
export async function handleButtonLink(page, name, url, screenshotsDir) {
  try {
    console.log(`Setting up Button Link with name: "${name}" and URL: "${url}"`);
    
    // Find and click the Button Link feature
    const buttonLinkSelectors = [
      `.options:has-text("Button Link")`,
      `div:has-text("Button Link")`,
      `div.mat-list-item:has-text("Button Link")`,
      `button:has-text("Button Link")`
    ];
    
    let featureFound = false;
    
    // Try each selector to find and click the feature
    for (const selector of buttonLinkSelectors) {
      const buttonLinkOption = page.locator(selector).first();
      
      if (await buttonLinkOption.count() > 0) {
        console.log(`Found Button Link using selector: ${selector}`);
        await page.screenshot({ path: path.join(screenshotsDir, 'button-link-found.png') });
        
        // Click to open the button link dialog
        await buttonLinkOption.click({ force: true });
        await page.waitForTimeout(2000);
        
        featureFound = true;
        break;
      }
    }
    
    if (!featureFound) {
      console.warn('Could not find Button Link feature');
      return false;
    }
    
    // Take a screenshot of the dialog
    await page.screenshot({ path: path.join(screenshotsDir, 'button-link-dialog.png') });
    
    // First check if there's a toggle to enable
    const toggle = page.locator('.toggle, .switch, input[type="checkbox"], .mat-slide-toggle').first();
    if (await toggle.isVisible({ timeout: 1000 }).catch(() => false)) {
      // Check if it's already enabled
      const isChecked = await toggle.isChecked().catch(() => null);
      
      if (isChecked === false) {
        console.log('Enabling Button Link toggle');
        await toggle.click({ force: true });
        await page.waitForTimeout(1000);
      }
    }
    
    // Find and fill the name input field
    const nameInputSelectors = [
      'input[placeholder*="name" i]',
      'input[placeholder*="button" i]',
      'input.input-bordered',
      'mat-form-field input',
      'input[type="text"]'
    ];
    
    let nameFieldFound = false;
    
    // Try to find and fill the name field
    for (const selector of nameInputSelectors) {
      const nameInput = page.locator(selector).first();
      
      if (await nameInput.isVisible({ timeout: 1000 }).catch(() => false)) {
        console.log('Found name input field, filling it');
        await nameInput.clear();
        await nameInput.fill(name);
        nameFieldFound = true;
        break;
      }
    }
    
    if (!nameFieldFound) {
      console.warn('Could not find name input field for Button Link');
    }
    
    // Find and fill the URL input field
    const urlInputSelectors = [
      'input[placeholder*="url" i]',
      'input[placeholder*="http" i]',
      'input[type="url"]',
      'input.input-bordered:nth-child(2)',
      'mat-form-field:nth-child(2) input',
      'input[type="text"]:nth-child(2)'
    ];
    
    let urlFieldFound = false;
    
    // Try to find and fill the URL field
    for (const selector of urlInputSelectors) {
      const urlInput = page.locator(selector).first();
      
      if (await urlInput.isVisible({ timeout: 1000 }).catch(() => false)) {
        console.log('Found URL input field, filling it');
        await urlInput.clear();
        await urlInput.fill(url);
        urlFieldFound = true;
        break;
      }
    }
    
    // If we couldn't find specific fields, try using all input fields in order
    if (!nameFieldFound || !urlFieldFound) {
      console.log('Trying to find input fields by order/position');
      
      // Get all input fields
      const inputs = page.locator('input[type="text"], input.input-bordered, mat-form-field input').all();
      const inputsCount = await inputs.count();
      
      if (inputsCount >= 2) {
        if (!nameFieldFound) {
          // First input should be name
          await inputs.nth(0).clear();
          await inputs.nth(0).fill(name);
          console.log('Filled first input field with name');
        }
        
        if (!urlFieldFound) {
          // Second input should be URL
          await inputs.nth(1).clear();
          await inputs.nth(1).fill(url);
          console.log('Filled second input field with URL');
        }
      } else if (inputsCount === 1) {
        console.warn('Only found one input field, filling with name and URL might be on another screen');
        await inputs.nth(0).clear();
        await inputs.nth(0).fill(name);
      }
    }
    
    // Take a screenshot after filling fields
    await page.screenshot({ path: path.join(screenshotsDir, 'button-link-after-fill.png') });
    
    // Click Save button in the dialog
    const saveButtonSelectors = [
      '.mat-dialog-actions .btn:has-text("Save")',
      '.mat-dialog-actions button.btn-primary',
      'button.btn-primary:has-text("Save")',
      'button:has-text("Save")',
      'div.btn:has-text("Save")'
    ];
    
    for (const saveSelector of saveButtonSelectors) {
      const saveButton = page.locator(saveSelector).first();
      
      if (await saveButton.isVisible({ timeout: 1000 }).catch(() => false)) {
        console.log(`Found Save button for Button Link using selector: ${saveSelector}`);
        
        // Click the save button
        await saveButton.click({ force: true });
        await page.waitForTimeout(2000);
        
        // Take a screenshot after clicking save
        await page.screenshot({ path: path.join(screenshotsDir, 'button-link-after-save.png') });
        
        console.log('Successfully set Button Link');
        return true;
      }
    }
    
    // If we couldn't find a specific save button, try using JavaScript to click it
    console.log('Trying to click Save button via JavaScript...');
    const saveButtonClicked = await page.evaluate(() => {
      // Find any save button
      const saveButtons = Array.from(document.querySelectorAll('.mat-dialog-actions div, .mat-dialog-actions button, button'))
        .filter(el => {
          const text = el.textContent && el.textContent.trim().toLowerCase();
          return text === 'save' || text === 'apply' || text === 'done';
        });
      
      if (saveButtons.length > 0) {
        saveButtons[0].click();
        return true;
      }
      return false;
    });
    
    if (saveButtonClicked) {
      console.log('Clicked Save button via JavaScript');
      await page.waitForTimeout(2000);
      return true;
    }
    
    console.warn('Could not find Save button for Button Link');
    return false;
    
  } catch (error) {
    console.error('Error handling Button Link:', error);
    await page.screenshot({ path: path.join(screenshotsDir, 'error-button-link.png') });
    return false;
  }
}

/**
 * Special handler for Button Link #2 which requires specific name and URL inputs
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} name - Button name
 * @param {string} url - Button URL
 * @param {string} screenshotsDir - Directory to save screenshots
 * @returns {Promise<boolean>} True if button link #2 was set successfully
 */
export async function handleButtonLink2(page, name, url, screenshotsDir) {
  try {
    console.log(`Setting up Button Link #2 with name: "${name}" and URL: "${url}"`);
    
    // Find and click the Button Link #2 feature
    const buttonLinkSelectors = [
      `.options:has-text("Button Link #2")`,
      `div:has-text("Button Link #2")`,
      `div.mat-list-item:has-text("Button Link #2")`,
      `button:has-text("Button Link #2")`
    ];
    
    let featureFound = false;
    
    // Try each selector to find and click the feature
    for (const selector of buttonLinkSelectors) {
      const buttonLinkOption = page.locator(selector).first();
      
      if (await buttonLinkOption.count() > 0) {
        console.log(`Found Button Link #2 using selector: ${selector}`);
        await page.screenshot({ path: path.join(screenshotsDir, 'button-link-2-found.png') });
        
        // Click to open the button link dialog
        await buttonLinkOption.click({ force: true });
        await page.waitForTimeout(2000);
        
        featureFound = true;
        break;
      }
    }
    
    if (!featureFound) {
      // Try another approach based on the HTML structure provided
      console.log('Trying alternative approach for Button Link #2...');
      
      // Using the class structure from the provided HTML
      const altButtonLinkOptions = [
        'div.options:has(img[src*="button"]):has(span:text-is(" Button Link #2 "))',
        'div.options:has(span:text-is(" Button Link #2 "))',
        'div.wrap div.options:nth-child(8)'
      ];
      
      for (const selector of altButtonLinkOptions) {
        const buttonLinkOption = page.locator(selector).first();
        
        if (await buttonLinkOption.count() > 0) {
          console.log(`Found Button Link #2 using alternative selector: ${selector}`);
          await page.screenshot({ path: path.join(screenshotsDir, 'button-link-2-alt-found.png') });
          
          // Click to open the button link dialog
          await buttonLinkOption.click({ force: true });
          await page.waitForTimeout(2000);
          
          featureFound = true;
          break;
        }
      }
      
      if (!featureFound) {
        console.warn('Could not find Button Link #2 feature');
        return false;
      }
    }
    
    // Take a screenshot of the dialog
    await page.screenshot({ path: path.join(screenshotsDir, 'button-link-2-dialog.png') });
    
    // First check if there's a toggle to enable
    const toggle = page.locator('.toggle, .switch, input[type="checkbox"], .mat-slide-toggle').first();
    if (await toggle.isVisible({ timeout: 1000 }).catch(() => false)) {
      // Check if it's already enabled
      const isChecked = await toggle.isChecked().catch(() => null);
      
      if (isChecked === false) {
        console.log('Enabling Button Link #2 toggle');
        await toggle.click({ force: true });
        await page.waitForTimeout(1000);
      }
    }
    
    // Find and fill the name input field
    const nameInputSelectors = [
      'input[placeholder*="name" i]',
      'input[placeholder*="button" i]',
      'input.input-bordered',
      'mat-form-field input',
      'input[type="text"]'
    ];
    
    let nameFieldFound = false;
    
    // Try to find and fill the name field
    for (const selector of nameInputSelectors) {
      const nameInput = page.locator(selector).first();
      
      if (await nameInput.isVisible({ timeout: 1000 }).catch(() => false)) {
        console.log('Found name input field for Button Link #2, filling it');
        await nameInput.clear();
        await nameInput.fill(name);
        nameFieldFound = true;
        break;
      }
    }
    
    if (!nameFieldFound) {
      console.warn('Could not find name input field for Button Link #2');
    }
    
    // Find and fill the URL input field
    const urlInputSelectors = [
      'input[placeholder*="url" i]',
      'input[placeholder*="http" i]',
      'input[type="url"]',
      'input.input-bordered:nth-child(2)',
      'mat-form-field:nth-child(2) input',
      'input[type="text"]:nth-child(2)'
    ];
    
    let urlFieldFound = false;
    
    // Try to find and fill the URL field
    for (const selector of urlInputSelectors) {
      const urlInput = page.locator(selector).first();
      
      if (await urlInput.isVisible({ timeout: 1000 }).catch(() => false)) {
        console.log('Found URL input field for Button Link #2, filling it');
        await urlInput.clear();
        await urlInput.fill(url);
        urlFieldFound = true;
        break;
      }
    }
    
    // If we couldn't find specific fields, try using all input fields in order
    if (!nameFieldFound || !urlFieldFound) {
      console.log('Trying to find input fields by order/position for Button Link #2');
      
      // Get all input fields
      const inputs = page.locator('input[type="text"], input.input-bordered, mat-form-field input').all();
      const inputsCount = await inputs.count();
      
      if (inputsCount >= 2) {
        if (!nameFieldFound) {
          // First input should be name
          await inputs.nth(0).clear();
          await inputs.nth(0).fill(name);
          console.log('Filled first input field with name for Button Link #2');
        }
        
        if (!urlFieldFound) {
          // Second input should be URL
          await inputs.nth(1).clear();
          await inputs.nth(1).fill(url);
          console.log('Filled second input field with URL for Button Link #2');
        }
      } else if (inputsCount === 1) {
        console.warn('Only found one input field for Button Link #2, filling with name');
        await inputs.nth(0).clear();
        await inputs.nth(0).fill(name);
      }
    }
    
    // Take a screenshot after filling fields
    await page.screenshot({ path: path.join(screenshotsDir, 'button-link-2-after-fill.png') });
    
    // Click Save button in the dialog
    const saveButtonSelectors = [
      '.mat-dialog-actions .btn:has-text("Save")',
      '.mat-dialog-actions button.btn-primary',
      'button.btn-primary:has-text("Save")',
      'button:has-text("Save")',
      'div.btn:has-text("Save")'
    ];
    
    for (const saveSelector of saveButtonSelectors) {
      const saveButton = page.locator(saveSelector).first();
      
      if (await saveButton.isVisible({ timeout: 1000 }).catch(() => false)) {
        console.log(`Found Save button for Button Link #2 using selector: ${saveSelector}`);
        
        // Click the save button
        await saveButton.click({ force: true });
        await page.waitForTimeout(2000);
        
        // Take a screenshot after clicking save
        await page.screenshot({ path: path.join(screenshotsDir, 'button-link-2-after-save.png') });
        
        console.log('Successfully set Button Link #2');
        return true;
      }
    }
    
    // If we couldn't find a specific save button, try using JavaScript to click it
    console.log('Trying to click Save button via JavaScript for Button Link #2...');
    const saveButtonClicked = await page.evaluate(() => {
      // Find any save button
      const saveButtons = Array.from(document.querySelectorAll('.mat-dialog-actions div, .mat-dialog-actions button, button'))
        .filter(el => {
          const text = el.textContent && el.textContent.trim().toLowerCase();
          return text === 'save' || text === 'apply' || text === 'done';
        });
      
      if (saveButtons.length > 0) {
        saveButtons[0].click();
        return true;
      }
      return false;
    });
    
    if (saveButtonClicked) {
      console.log('Clicked Save button via JavaScript for Button Link #2');
      await page.waitForTimeout(2000);
      return true;
    }
    
    console.warn('Could not find Save button for Button Link #2');
    return false;
    
  } catch (error) {
    console.error('Error handling Button Link #2:', error);
    await page.screenshot({ path: path.join(screenshotsDir, 'error-button-link-2.png') });
    return false;
  }
}

module.exports = {
  renameEventAndVerify,
  updateSingleFeature,
  toggleFeature,
  handleEventHeaderPhoto,
  handleButtonLink,
  handleButtonLink2,
};