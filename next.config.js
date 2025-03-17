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
    ];
  },
};

module.exports = nextConfig;
