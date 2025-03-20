/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["lucide-react"],
  redirects: async () => {
    return [
      {
        source: "/browse",
        destination: "/prompts",
        permanent: true, // triggers 308
      },
      {
        source: "/favorites",
        destination: "/prompts/favorites",
        permanent: true, // triggers 308
      },
      {
        source: "/my",
        destination: "/prompts/my",
        permanent: true, // triggers 308
      },
    ];
  },
};

module.exports = nextConfig;
