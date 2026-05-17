/** @type {import('next').NextConfig} */
const nextConfig = {
  /** Lets you open dev from another device on LAN without Next blocking HMR. */
  allowedDevOrigins: ["192.168.1.2"],

  images: {
    remotePatterns: ["lh1", "lh2", "lh3", "lh4", "lh5", "lh6"].map((sub) => ({
      protocol: "https",
      hostname: `${sub}.googleusercontent.com`,
      pathname: "/**",
    })),
  },
};

export default nextConfig;
