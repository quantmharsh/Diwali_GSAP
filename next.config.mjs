/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permit this machine's LAN address to load Next.js dev assets on a phone.
  allowedDevOrigins: ['192.168.1.10'],
};

export default nextConfig;
