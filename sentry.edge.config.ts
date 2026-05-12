import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Only track errors, no performance monitoring
  tracesSampleRate: 0,

  // Only send errors in production
  enabled: process.env.NODE_ENV === "production",
});
