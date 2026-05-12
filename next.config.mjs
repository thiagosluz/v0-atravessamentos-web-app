import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xbeorszuxfpfvqprppzw.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

export default withSentryConfig(nextConfig, {
  // Sentry organization and project (injected by Vercel Marketplace)
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Upload source maps for readable stack traces in production
  sourcemaps: {
    deleteSourcemapsAfterUpload: true,
  },

  // Remove debug logging from production bundle
  bundleSizeOptimizations: {
    excludeDebugStatements: true,
  },

  // Only show upload logs in CI
  silent: !process.env.CI,
});
