import { test as setup } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
import { loginViaGoogle } from './helpers/auth.js';

// Create screenshots directory if it doesn't exist
const screenshotsDir = path.join(__dirname, '..', 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Create auth directory if it doesn't exist
const authDir = path.join(__dirname, 'auth');
if (!fs.existsSync(authDir)) {
  fs.mkdirSync(authDir, { recursive: true });
}

// Path to the authentication state
const authFile = path.join(authDir, 'user-auth.json');

// Authentication setup
setup('authenticate', async ({ page, context }) => {
  // Set long timeout for auth process
  setup.setTimeout(180000);
  
  console.log('Starting authentication setup...');
  
  // Check if auth file already exists and is not too old
  if (fs.existsSync(authFile)) {
    const stats = fs.statSync(authFile);
    const fileAge = (new Date().getTime() - stats.mtime.getTime()) / (1000 * 60 * 60); // age in hours
    
    if (fileAge < 24) { // Less than 24 hours old
      console.log(`Using existing auth state (${fileAge.toFixed(2)} hours old)`);
      return;
    }
    
    console.log(`Auth state is ${fileAge.toFixed(2)} hours old, refreshing it`);
  }
  
  // Perform Google login
  try {
    await loginViaGoogle(page, screenshotsDir, context, authFile);
    console.log('Authentication successful, auth state saved to:', authFile);
  } catch (error) {
    console.error('Authentication setup failed:', error);
    throw error;
  }
}); 