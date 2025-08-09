import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
let nextConfig = {
    // Remove deprecated options
    // swcMinify and fastRefresh are enabled by default in newer Next.js versions
    
    // Use the correct property name for external packages
    serverExternalPackages: [],
    
    // For SSL issues in development, we'll handle this differently
    // since env config is not allowed for NODE_TLS_REJECT_UNAUTHORIZED
};

if (process.env.ANALYZE === 'true') {
    const withBundleAnalyzer = require('@next/bundle-analyzer')({
        enabled: true,
    });
    nextConfig = withBundleAnalyzer(nextConfig);
}

export default withNextIntl(nextConfig);
