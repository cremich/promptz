import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/browse/my", "/prompt/drafts", "/auth"],
    },
    sitemap: "https://promptz.dev/sitemap.xml",
  };
}
