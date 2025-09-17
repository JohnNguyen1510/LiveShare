# Document to run test for the V3 DMS project

# Introduction

* This document provides a comprehensive guide to cloning, setting up, and running automation tests from the GitHub repository at [https://github.com/spectrio-ir-dang/my-v3-dms-auto-playwright](https://github.com/spectrio-ir-dang/my-v3-dms-auto-playwright).
* The project is an automation testing framework built with Playwright, a popular end-to-end testing library for web applications. It tests a V3 DMS application and features authentication state management, custom reporting with TestRail integration, and webpack bundling.
* The guide covers prerequisites, installation, configuration, running tests (both individual cases and the full suite), viewing results, and troubleshooting. All instructions work across macOS, Windows, and Linux environments.

---

# Prerequisites

-Before proceeding, ensure your development environment is prepared. This section covers downloading and installing essential tools.

1. **Install Node.js and npm**

   -Node.js is the runtime environment for JavasScript , and npm (Node Package Manager) is used to install project dependencies.

   * Instruction for download and install :

     * Visit the official Node.js website : [https://nodejs.org/](https://nodejs.org/)
     * For Windows/macOS: Run the installer (.msi for Windows, .pkg for macOS) and follow the prompts. Ensure the option to install npm is selected.
   * Verify Installation : Open a terminal (Command Prompt on Windows, Terminal on macOS/Linux) and run:

     ```
     node --version
     npm --version
     ```
2. **Install Git**

   -Git is required for cloning the repository.

   * Download and Install :

     * Visit [https://git-scm.com/downloads](https://git-scm.com/downloads) and download the version for your OS.
   * Verify Installation with terminal :

     ```
     git --version
     ```
3. **Install Visual Studio Code (VS Code)**

   -VS Code is a recommended code editor for this project, supporting JavaScript/TypeScript debugging and extensions for Playwright.

   * Download and Install :

     * Visit [https://code.visualstudio.com/download](https://code.visualstudio.com/download) and download the installer for your OS.
     * Run the installer and follow the prompts. Add VS Code to your PATH if prompted.
4. **Brefie structure about the project :**

   * playwright-report/: Folder for generated HTML test reports.
   * src/: Contains the source code for tests (likely test files like .spec.js or .spec.ts).
   * test-results/: Stores artifacts like screenshots, videos, or traces from failed tests.
   * .gitignore: Specifies files/folders to ignore in Git (e.g., node\_modules).
   * README.md: Project documentation (review this for any custom notes).
   * globals.d.ts: TypeScript declaration file for global variables.
   * jsconfig.json: Configuration for JavaScript projects in VS Code.
   * package.json: Defines project dependencies, scripts, and metadata.
   * playwright.config.js: Main configuration file for Playwright (e.g., browsers, timeouts, reporters).
   * save-complete-auth.js: Script to save authentication state (e.g., for logged-in sessions).
   * testrail-reporter.js: Custom reporter for integrating with TestRail (a test management tool).
   * webpack.config.js: Webpack configuration for bundling code (if the project uses it for builds).
5. **Detail instruction to run the project**

   * Step 1 : Cloning the Repository

     1. Clone the repository :

        ```jsx
        git clone https://github.com/spectrio-ir-dang/my-v3-dms-auto-playwright.git
        ```

     2. Navigate into the project folder :

        ```jsx
        cd my-v3-dms-auto-playwright
        ```
   * Step 3 : Create new file .env for the project
       ```jsx
        MODE=dev
        MPDM_USERNAME=admin@inreality.com
        MPDM_PASSWORD=389102901
        PROD_V3_USERNAME=hktest@dcsg.com
        PROD_V3_PASSWORD=no69eZ55P6EV
        GEMINI_API_KEY=AIzaSyBFe5_pzBgU7R489P9xj1ICWBustwgrHis
        V2_API_KEY=4aviNvEiWgydwE9ctj-CTb8Q.Ljr-ziGzBR6wA
        API_KEY=hT3HhDEqapsegMvEc2RpHiARs
        BEARER_TOKEN=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImNOaXlxMGNKY0x4UUliTlU3dEZhNiJ9.eyJodHRwczovL3d3dy5pbnJlYWxpdHkuY29tL2NsYWltcy9lbWFpbCI6ImhvYW4ubmd1eWVuQHNwZWN0cmlvLmNvbSIsImVtYWlsIjoiaG9hbi5uZ3V5ZW5Ac3BlY3RyaW8uY29tIiwibmFtZSI6IkhvYW4gTmd1eWVuIiwib3JnYW5pemF0aW9ucyI6W3siYXBwX3JvbGVzIjpbeyJpc0RlZmF1bHQiOnRydWUsInJvbGVfaWQiOiI2NjlmMzAwNDA5NGZlZmMwNzQ1MDcwY2MifV0sIm9yZ19pZCI6IjY2OWYzMDAwMDk0ZmVmYzA3NDUwNzBjNCIsIm9yZ19uYW1lIjoiRW5nYWdlIEN1c3RvbWVyIn1dLCJpcl9hY2NvdW50X2lkIjoiNjY5ZjMwMDAwOTRmZWZjMDc0NTA3MGM0Iiwib3JnYW5pemF0aW9uX2lkIjoiNjY5ZjMwMDAwOTRmZWZjMDc0NTA3MGM0IiwiaXJfcm9sZV9pZCI6IjY2OWYzMDA0MDk0ZmVmYzA3NDUwNzBjYyIsImlzcyI6Imh0dHBzOi8vYXV0aDAtZGV2LmlucmVhbGl0eS5jb20vIiwic3ViIjoiZ29vZ2xlLW9hdXRoMnwxMDI3NDg3NzIxNDA4NDU4MTAwMDgiLCJhdWQiOlsiaHR0cHM6Ly92My1kZXYuaW5yZWFsaXR5LmNvbS92My9hcGkvIiwiaHR0cHM6Ly9kZXYtaW5yZWFsaXR5LnVzLmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE3NTU3NzMzNDcsImV4cCI6MTc1NTg1OTc0Nywic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsImF6cCI6IjZtdWVSeWpENTVSN2NkR2ppRWRxR2JOZFAxdnJGVTR0IiwicGVybWlzc2lvbnMiOltdfQ.F0-IkO5PVgV6ttwPL6wNo0d6V7aDPRYzJKaXAQq6O_FQRmH37UEu1qV3QYWKliL8leWrz4zJsrbi1Zrr6zZcKFFxfDO3c--2kHR6pPpcgIQvHOYZ_hOcfGLb5JRaeTETzuTw3HYORRVh28l8jwA4hYsOzkV9N1ziGAWfSZ5WBYWbVX8Lna25Y3iArkoSFUAmIeMMiroX1mk3qPBgZYA3hKzhA6gVF4YL7z6XH6RBexKYjCwVfRlEbqngKIhh8WopwWZd7tT3RHD3T1sfMnedOsshFQ9O2uUyI0XAwEum7H9Sewv5wPdOZmqNyijY3yajyuSXTPVAfXleHHk-JpAmKw
        ```

   * Step 2 : Setting Up the Project

     1. Install Dependencies :

        ```jsx
        npm install
        ```

     2. Install Playwright Browsers :

        ```jsx
        npx playwright install
        ```

     3. Configure Authentication : The project includes save-complete-auth.js, likely for persisting login sessions to avoid repeated logins.

        ```jsx
        node save-complete-auth.js
        ```
   * Step 3 : Running Test Cases

     1. Run a Specific Test File:

        ```jsx
        npx playwright test src/path/to/your-test-file.spec.js
        ```

     2. Run all Test File:

        ```jsx
        npx playwright test
        ```

     3. Run a Specific Test Case (by Title) : Use the -g flag for grep:

        ```jsx
        npx playwright test -g "C13334"
        ```

     4. UI Mode (for Debugging):

        * Here is the picture example about run the test case with mode —ui , you can choose source , error and console or network to get more detail about test case after run success .

        ![Screen Shot 2025-09-15 at 18.38.30.png](attachment:37f68e22-4e9f-47d8-a80c-1e10c9739b6b\:Screen_Shot_2025-09-15_at_18.38.30.png)

        ```jsx
        npx playwright test src/your-test.spec.js --ui
        ```

     5. **Debug Mode:**

        ```jsx
        npx playwright test src/your-test.spec.js --debug
        ```
   * Step 4 : Running test in different enviroment
      * Option 1 : Change MODE by command in terminal .   
     ```jsx
     # Development environment
     MODE=dev npx playwright test

     # Staging environment  
     MODE=staging npx playwright test

     # Production environment
     MODE=production npx playwright test
     ```
      * Option 2 : Change MODE by .env file.
     ```jsx
        MODE=dev | staging | production
     ```  

     
     
6. **Environment Configuration**

* DMS Environments (src/dms/config/) : Place to store configuration include(apiBaseUrl , username , password , url for each page ) is used to run test for each aplication ,

  * **Development (dev.js):**

    ```jsx
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
            // ... other page configurations
        }
    };
    ```

  * **Production (production.js):**

    ```jsx
    module.exports = {
        apiBaseURL: 'https://app.inreality.com/',
        baseURL: 'https://app.inreality.com/v3/auth0/',
        username: process.env.PROD_V3_USERNAME,
        password: process.env.PROD_V3_PASSWORD,
        // ... production-specific configurations
    };
    ```
  * **More explanation how environment configuration works:**
    * On top line of file(/src/page/formula-editor-page.js) and the same with another one always have line for import configure enviroment into file :
    ```jsx
    const config = require('../config/config-loader');
    ```
    * An example of how the configs are used in the test file(/src/page/formula-editor-page.js):
    ```jsx
    async goToPerformanceScorePage() {
        await this.page.goto(config.pageURL.performanceScore.url);
        await this.page.waitForLoadState('networkidle');
        await this.performanceScoreHeader.waitFor({ state: 'visible', timeout: 30000 });
    }
    ```


1. **Configure Playwright :**

   The playwright.config.js file is the heart of your testing configuration. It controls how tests are executed, which browsers to use, timeout settings, and many other important aspects of your test suite.

   * **Test Directory and Timeout Configuration:**

     The testDir tells Playwright where to look for your test files. If you have tests in different folders, you can change this path. The timeout setting prevents tests from running indefinitely - if a test takes longer than 3 minutes, it will automatically fail. The expect.timeout specifically controls how long Playwright waits for assertions to pass.

     ```jsx
     module.exports = defineConfig({
         testDir: './src/dms/tests',        // Specifies where your test files are located
         timeout: 3 * 60 * 1000,           // Sets maximum time (3 minutes) for each test to complete
         expect: {
             timeout: 10000                 // Sets timeout (10 seconds) for assertions like expect().toBeVisible()
         },
     });
     ```

   * **Parallel Execution Settings:**

     Setting fullyParallel to false means tests run one after another, which is important for this project because tests share authentication state. Using workers: 1 ensures only one test runs at a time, preventing conflicts. You can increase retries if you want Playwright to automatically re-run failed tests.

     ```jsx
     fullyParallel: false,    // Controls whether tests run simultaneously
     workers: 1,              // Number of parallel test processes
     retries: 0,              // How many times to retry failed tests
     ```

   * **Browser Configuration:**

     When you uncomment Firefox and WebKit sections, your tests will run on all three browser engines. This is valuable for cross-browser compatibility testing, ensuring your application works correctly across different browsers.

     ```jsx
     projects: [
         {
             name: 'chromium',
             use: { browserName: 'chromium' },
         },
         // Uncomment these sections to enable additional browsers:
         {
             name: 'firefox',
             use: {
                 browserName: 'firefox',
                 storageState: fs.existsSync(authFile) ? authFile : undefined,
             },
         },
         {
             name: 'webkit',
             use: {
                 browserName: 'webkit',
                 storageState: fs.existsSync(authFile) ? authFile : undefined,
             },
         },
     ],
     ```

   * **Visual and Debugging Configuration:**

     Setting headless: false means you can watch the browser execute your tests, which is helpful for debugging. The video and trace options create recordings that help you understand what happened when tests fail. slowMo makes the browser actions slower so you can follow what's happening.

     ```jsx
     use: {
         headless: false,                    // Shows browser window during test execution
         viewport: { width: 1280, height: 720 }, // Sets browser window size
         video: 'on-first-retry',           // Records video when tests are retried
         trace: 'on-first-retry',           // Captures detailed execution trace
         screenshot: 'only-on-failure',     // Takes screenshots when tests fail
         launchOptions: {
             slowMo: 100,                   // Adds 100ms delay between actions for visibility
         },
     }
     ```

   * **Reporting Configuration:**

     You can enable multiple reporters simultaneously. The list reporter shows real-time progress, html creates a detailed visual report, and the custom TestRail reporter sends results to your test management system.
     ```jsx
     reporter: [
          ['list'],                          // Shows test progress in console
          ['html'],                          // Generates HTML report
          ['./testrail-reporter.js']         // Custom TestRail integration
      ],
     ```

     
