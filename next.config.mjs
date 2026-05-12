/** @type {import('next').NextConfig} */
const nextConfig = {
  /** Lets you open dev from another device on LAN without Next blocking HMR. */
  allowedDevOrigins: ["192.168.1.2"],
};

export default nextConfig;
