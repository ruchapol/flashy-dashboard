/**
 * Build-time / dev-server config.
 * - Vite proxy uses VITE_BACKEND_URL (see vite.config.ts).
 * - App uses VITE_API_BASE_URL for fetch base (see src/shared/config.ts).
 */

export const DEV_PROXY_TARGET = "http://localhost:8000";

export function getBackendUrlFromEnv(env: Record<string, string>): string {
  return env.VITE_BACKEND_URL ?? DEV_PROXY_TARGET;
}
