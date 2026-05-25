/**
 * Utility for managing Basic Authorization token
 */

const AUTH_TOKEN_KEY = 'authorization_token';
const AUTH_USERNAME_KEY = 'auth_username';
const AUTH_PASSWORD_KEY = 'auth_password';

/**
 * Generate a Base64-encoded Basic Authorization token
 * Format: base64(username:password)
 */
export function generateAuthorizationToken(username: string, password: string): string {
  const credentials = `${username}:${password}`;
  return Buffer.from(credentials).toString('base64');
}

/**
 * Store authorization credentials in localStorage
 */
export function storeAuthorizationToken(username: string, password: string): void {
  try {
    const token = generateAuthorizationToken(username, password);
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USERNAME_KEY, username);
    localStorage.setItem(AUTH_PASSWORD_KEY, password);
    console.log('Authorization token stored successfully');
  } catch (error) {
    console.error('Failed to store authorization token:', error);
  }
}

/**
 * Get the stored authorization token
 */
export function getAuthorizationToken(): string | null {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch (error) {
    console.error('Failed to get authorization token:', error);
    return null;
  }
}

/**
 * Clear the stored authorization token
 */
export function clearAuthorizationToken(): void {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USERNAME_KEY);
    localStorage.removeItem(AUTH_PASSWORD_KEY);
    console.log('Authorization token cleared');
  } catch (error) {
    console.error('Failed to clear authorization token:', error);
  }
}

/**
 * Initialize default authorization token
 * This sets up a default token for the test user
 */
export function initializeDefaultAuthorizationToken(): void {
  const token = getAuthorizationToken();
  if (!token) {
    // Default test credentials
    storeAuthorizationToken('leokotman', 'TEST_PASSWORD');
  }
}
