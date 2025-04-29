import { test as baseTest } from '@playwright/test';
import * as path from 'path';

// Path to the authentication state
const authFile = path.join(process.cwd(), 'tests', 'auth', 'user-auth.json');

// Create a fixture for settings status and saved event URL
export const test = baseTest.extend({
  // Track if setup is complete across all tests
  setupComplete: [false, { scope: 'worker' }],
  
  // Use the authentication state in all tests
  storageState: ({}, use) => use(authFile),
  
  // Store event URL between tests
  savedEventUrl: [null, { scope: 'worker' }]
});