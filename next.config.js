/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'vvuzagvjpovdibhoxtvm.supabase.co',
                port: '',
            }
        ],
    },
};

module.exports = nextConfig;
