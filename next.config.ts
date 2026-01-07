import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
  // Configure remote image hosts used in the app (e.g. placeholder images)
  images: {
    domains: ['via.placeholder.com'],
  },
  // Opt-in to strict mode for React where desired
  reactStrictMode: true,
};

export default withNextIntl(nextConfig);
