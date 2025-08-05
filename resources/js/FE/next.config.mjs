import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
let nextConfig = {
    swcMinify: true,
    fastRefresh: true,
};

if (process.env.ANALYZE === 'true') {
    const withBundleAnalyzer = require('@next/bundle-analyzer')({
        enabled: true,
    });
    nextConfig = withBundleAnalyzer(nextConfig);
}

export default withNextIntl(nextConfig);
