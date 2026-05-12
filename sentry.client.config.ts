import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Only track errors, no performance monitoring
  tracesSampleRate: 0,

  // No session replay
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,

  // Filter noisy errors
  ignoreErrors: [
    // Browser extensions
    "top.GLOBALS",
    // Network errors
    "Failed to fetch",
    "NetworkError",
    "Load failed",
    // Next.js client-side navigation
    "NEXT_NOT_FOUND",
    "NEXT_REDIRECT",
  ],

  // Only send errors in production
  enabled: process.env.NODE_ENV === "production",
});
