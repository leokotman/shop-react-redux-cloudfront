/**
 * Utility for managing Basic Authorization token
 */

const AUTH_TOKEN_KEY = 'authorization_token';
const AUTH_USERNAME_KEY = 'auth_username';
const AUTH_PASSWORD_KEY = 'auth_password';

function encodeBase64(value: string): string {
  const bytes = new TextEncoder().encode(value);
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let encoded = '';

  for (let index = 0; index < bytes.length; index += 3) {
    const chunk =
      (bytes[index] << 16) |
      ((bytes[index + 1] ?? 0) << 8) |
      (bytes[index + 2] ?? 0);

    encoded += alphabet[(chunk >> 18) & 63];
    encoded += alphabet[(chunk >> 12) & 63];
    encoded += index + 1 < bytes.length ? alphabet[(chunk >> 6) & 63] : '=';
    encoded += index + 2 < bytes.length ? alphabet[chunk & 63] : '=';
  }

  return encoded;
}

/**
 * Generate a Base64-encoded Basic Authorization token
 * Format: base64(username:password)
 */
export function generateAuthorizationToken(username: string, password: string): string {
  const credentials = `${username}:${password}`;
  return encodeBase64(credentials);
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

