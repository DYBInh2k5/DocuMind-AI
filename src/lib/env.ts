/**
 * Environment variable validation
 * Returns empty string if not defined instead of throwing error
 */

export function getEnvVar(key: string, defaultValue: string = ''): string {
  if (typeof window !== 'undefined') {
    type ClientEnvWindow = Window & { ENV?: Record<string, string> };
    const clientWindow = window as ClientEnvWindow;
    // Client side
    return clientWindow.ENV?.[key] || defaultValue;
  }
  // Server side
  return process.env[key] || defaultValue;
}

export function requireEnvVar(key: string): string {
  const value = getEnvVar(key);
  if (!value && process.env.NODE_ENV !== 'production') {
    console.warn(`Warning: ${key} is not set`);
  }
  return value;
}
