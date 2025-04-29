# LiveShare Test Automation

This repository contains end-to-end tests for the LiveShare application using Playwright.

## Project Structure

```
LiveShare/
├── tests/
│   ├── auth.setup.js       # Authentication setup script
│   ├── eventFlow.spec.js   # Main event flow test cases
│   ├── helpers/            # Helper functions
│   │   ├── auth.js         # Authentication helpers
│   │   ├── navigation.js   # Navigation helpers
│   │   └── settings.js     # Settings configuration helpers
│   └── fixtures/           # Test fixtures
│       └── eventFixtures.js # Event test fixtures
├── screenshots/            # Test screenshots (created during test runs)
├── auth/                   # Auth state storage (created during test runs)
├── playwright.config.js    # Playwright configuration
└── package.json            # Project dependencies
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

3. Configure environment variables:
   - Create a `.env` file in the root directory with the following content:
   ```
   # Google Auth credentials
   GOOGLE_EMAIL=your-email@example.com
   GOOGLE_PASSWORD=your-password
   
   # Base URL
   BASE_URL=https://app.livesharenow.com
   ```

## Running Tests

### Authentication Setup

Before running the main tests, it's recommended to run the authentication setup:

```bash
npm run test:setup
```

This will create an authenticated session state that will be reused in subsequent tests.

### Run Event Flow Tests

Run the event flow tests:

```bash
npm run test:events
```

### Run All Tests

Run all tests in sequence:

```bash
npm test
```

### Debug Tests

Run tests in debug mode:

```bash
npm run test:debug
```

### View Test Report

After running tests, view the HTML report:

```bash
npm run report
```

## Test Cases

The test suite covers the following scenarios:

1. **Authentication**: Login using Google authentication
2. **Event Settings**: Configure event settings including name, access code, event managers, etc.
3. **Event Verification**: Verify event name, date, location, and other details
4. **Feature Verification**: Verify features like header photo, button links, etc.

## Debugging Tests

The tests are configured to save screenshots at various stages in the `screenshots` directory to help with debugging.

### Common Issues and Solutions

#### Google Sign-in Issues

- **Could not find Google sign-in iframe**: The test looks for Google authentication elements using multiple selectors. If the test fails, check the screenshots in the `screenshots` directory to see what the UI actually looks like.

- **Authentication failures**: Make sure your test credentials are correct and have proper permissions. Consider using a test-specific Google account.

#### Timeouts

- If tests timeout, try increasing the timeout values in the `playwright.config.js` file.

## CI/CD Integration

For CI/CD integration, ensure you securely store the Google credentials as environment variables.

Example GitHub Actions workflow:

```yaml
name: Playwright Tests
on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: 18
    - name: Install dependencies
      run: npm ci
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
    - name: Run Playwright tests
      run: npx playwright test
      env:
        GOOGLE_EMAIL: ${{ secrets.GOOGLE_EMAIL }}
        GOOGLE_PASSWORD: ${{ secrets.GOOGLE_PASSWORD }}
    - uses: actions/upload-artifact@v3
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
``` 