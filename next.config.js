/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    remotePatterns: [
      { hostname: "res.cloudinary.com" },
      { hostname: "images.unsplash.com" },
      { hostname: "avatars.githubusercontent.com" },
    ],
  },
  async redirects() {
    return [
      {
        source: "/stratum",
        destination: "https://stratum-sepia.vercel.app",
        permanent: false,
      },
      {
        source: "/stratum/:path*",
        destination: "https://stratum-sepia.vercel.app/:path*",
        permanent: false,
      },
    ];
  },
};
