/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', 
  experimental: {
    outputFileTracingIncludes: {
      '/api/**/*': ['./generated/prisma/**/*'],
    },
  },
};

export default nextConfig;
