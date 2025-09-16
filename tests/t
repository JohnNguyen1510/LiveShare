# V3 DMS — Playwright Automation

> Comprehensive guide to clone, set up, and run automation tests for the V3 DMS project using Playwright.

---

## Table of Contents

1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Project structure](#project-structure)
4. [Setup — clone & install](#setup--clone--install)
5. [Save authentication state](#save-authentication-state)
6. [Run tests](#run-tests)
7. [Run tests in different environments](#run-tests-in-different-environments)
8. [Environment configuration files (DMS)](#environment-configuration-files-dms)
9. [Playwright configuration highlights](#playwright-configuration-highlights)
10. [Reporting & artifacts](#reporting--artifacts)
11. [Troubleshooting](#troubleshooting)
12. [Notes & best practices](#notes--best-practices)
13. [License / Contact](#license--contact)

---

## Introduction

This repository contains an end-to-end automation testing framework for the **V3 DMS** application built with **Playwright**. The test suite supports authentication-state management, custom reporting (including TestRail integration), and webpack bundling where applicable.

This README explains how to clone the repo, install dependencies, configure environments, run tests (single file, specific case, or full-suite), view results, and troubleshoot common issues across macOS, Windows, and Linux.

---

## Prerequisites

Before running the project, make sure the following tools are installed on your machine:

### 1. Node.js & npm

* Node.js is the JavaScript runtime and npm is the package manager used to install project dependencies.
* Download: [https://nodejs.org/](https://nodejs.org/)

Verify installation:

```bash
node --version
npm --version
```

### 2. Git

* Required to clone the repository.
* Download: [https://git-scm.com/downloads](https://git-scm.com/downloads)

Verify installation:

```bash
git --version
```

### 3. Visual Studio Code (recommended)

* Recommended editor for JavaScript/TypeScript and Playwright debugging.
* Download: [https://code.visualstudio.com/](https://code.visualstudio.com/)

---

## Project structure (brief)

```
playwright-report/        # Generated HTML test reports
src/                      # Test source code (e.g. .spec.js / .spec.ts)
test-results/             # Artifacts: screenshots, videos, traces
.gitignore
README.md                 # This file
globals.d.ts              # TypeScript global declarations
jsconfig.json             # VSCode JS project config
package.json              # Dependencies & scripts
playwright.config.js      # Playwright configuration
save-complete-auth.js     # Script to persist authentication state
testrail-reporter.js      # Custom TestRail reporter
webpack.config.js         # Webpack config (if used)
```

---

## Setup — clone & install

### Step 1 — Clone the repository

```bash
git clone https://github.com/spectrio-ir-dang/my-v3-dms-auto-playwright.git
cd my-v3-dms-auto-playwright
```

### Step 2 — Install dependencies

```bash
npm install
```

### Step 3 — Install Playwright browsers

```bash
npx playwright install
```

---

## Save authentication state

The repository includes a helper script `save-complete-auth.js` that can be used to persist authentication state so tests do not need to log in repeatedly. Run it like:

```bash
node save-complete-auth.js
```

> The script will create a storage state file (auth file) that Playwright can reuse via `storageState` in `playwright.config.js`.

---

## Run tests

### Run a specific test file

```bash
npx playwright test src/path/to/your-test-file.spec.js
```

### Run all tests

```bash
npx playwright test
```

### Run a specific test case (by title / grep)

```bash
npx playwright test -g "C13334"
```

### Run with the Playwright UI (helpful for debugging)

```bash
npx playwright test src/your-test.spec.js --ui
```

When you run with `--ui` you can inspect source, errors, console messages and network requests in the Playwright UI.

### Debug mode

```bash
npx playwright test src/your-test.spec.js --debug
```

---

## Run tests in different environments

Set the `MODE` environment variable before running tests to point tests at different environments (dev / staging / production). Example:

```bash
# macOS / Linux
MODE=dev npx playwright test
MODE=staging npx playwright test
MODE=production npx playwright test

# Windows (PowerShell)
$env:MODE = "dev"; npx playwright test
```

> The test code reads configuration from files under `src/dms/config/` and chooses the appropriate config according to `MODE`.

---

## Environment configuration files (DMS)

Configuration files live in `src/dms/config/`. They typically expose fields such as `apiBaseURL`, `baseURL`, `username`, `password`, and named page URLs.

Example **dev.js**:

```js
module.exports = {
  apiBaseURL: 'https://v3-dev.inreality.com/',
  baseURL: 'https://v3-dev.inreality.com/v3/auth0/',
  username: 'hoan.nguyen@spectrio.com',
  password: 'Hoan@123',
  pageURL: {
    dashboard: {
      url: 'https://v3-dev.inreality.com/v3/auth0/dashboard',
      name: 'autoDashboard'
    }
    // ... other page configs
  }
};
```

Example **production.js** (use environment variables for secrets):

```js
module.exports = {
  apiBaseURL: 'https://app.inreality.com/',
  baseURL: 'https://app.inreality.com/v3/auth0/',
  username: process.env.PROD_V3_USERNAME,
  password: process.env.PROD_V3_PASSWORD,
  // ... production-specific configs
};
```

**Important:** Keep production credentials out of source control. Use environment variables or secret management.

---

## Playwright configuration highlights

The `playwright.config.js` file controls how tests run. Important options used by this project:

* `testDir` — where test files are located (e.g. `./src/dms/tests`).
* `timeout` — maximum time a test can run (e.g. `3 * 60 * 1000` for 3 minutes).
* `expect.timeout` — timeout for Playwright assertions (e.g. `10000` ms).
* `fullyParallel: false` & `workers: 1` — ensures tests run sequentially (important when reusing shared authentication state).
* `retries` — how many times to automatically retry failed tests.

### Browser projects

Example projects block (Chromium, Firefox, WebKit). The codebase may use a shared `authFile` (storage state) when available:

```js
projects: [
  { name: 'chromium', use: { browserName: 'chromium' } },
  {
    name: 'firefox',
    use: { browserName: 'firefox', storageState: fs.existsSync(authFile) ? authFile : undefined }
  },
  {
    name: 'webkit',
    use: { browserName: 'webkit', storageState: fs.existsSync(authFile) ? authFile : undefined }
  }
]
```

### Visual & debugging features

* `headless: false` — show the browser during runs (helpful when debugging).
* `video: 'on-first-retry'` & `trace: 'on-first-retry'` — capture artifacts on retries for investigation.
* `screenshot: 'only-on-failure'` — take screenshots when tests fail.
* `launchOptions.slowMo` — add a small delay between actions while debugging.

---

## Reporting & artifacts

* **HTML reports** are generated into `playwright-report/`. Open the generated `index.html` after a run to view a navigable report.
* **test-results/** stores raw artifacts: screenshots, videos, and traces for failed tests.
* The project includes `testrail-reporter.js` for pushing results to TestRail when enabled.

Generate an HTML report and open it locally:

```bash
# after running tests
npx playwright show-report
```

---

## Troubleshooting

**1. Install / version issues**

* If Node/npm versions are incompatible, upgrade/downgrade Node using `nvm` (recommended).

**2. Playwright browser download fails**

* Re-run `npx playwright install` and ensure you have network access. Check firewall/proxy settings.

**3. Authentication / storage state issues**

* Re-run `node save-complete-auth.js` to regenerate the storage state file.
* Confirm the path to `storageState` in `playwright.config.js` is correct.

**4. Tests interfering with each other**

* Ensure `fullyParallel` is `false` and `workers` is `1` if tests share authentication state, or refactor tests to be isolated.

**5. Debugging a failing test**

* Run the failing test with `--ui` or `--debug` to see browser actions, console output, and network traffic.
* Review artifacts in `test-results/` and `playwright-report/` for screenshots and traces.

---

## Notes & best practices

* Store secrets (production credentials) outside the repository. Use environment variables or a secrets manager.
* Keep tests deterministic: avoid flaky selectors and rely on stable locators or data-test attributes.
* When adding cross-browser runs, test gradually and ensure `storageState` is compatible across browsers if reusing it.
* Use retries and artifact capture strategically to debug intermittent failures.

---

## License / Contact

If you need help or want to report issues, please open an issue in the repository or contact the project owner.

---

*Generated README for the `my-v3-dms-auto-playwright` repository.*
