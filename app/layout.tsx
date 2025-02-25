import ConfigureAmplifyClientSide from "@/app/configure-amplify";
import type { Metadata, Viewport } from "next";
import { geistMono, geistSans } from "@/app/ui/fonts";
import "@/app/globals.css";
import TopNav from "@/app/ui/navigation/topnav";
import { ThemeProvider } from "@/app/ui/navigation/theme-provider";
import Footer from "@/app/ui/footer/footer";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "PROMPTZ - Discover, Create, and Share Prompts for Amazon Q Developer",
  description:
    "Simplify prompt engineering for Amazon Q Developer with the ultimate prompt library for Amazon Q Developer. Discover, create, and perfect prompts for Amazon Q Developer. Explore a rich library of categorized prompts, share your own, and collaborate with the community to enhance your software development lifecycle. ",
  keywords:
    "promptz, prompt, prompt engineering, Amazon Q Developer, prompt library, promptz.dev, software development lifecycle, SDLC prompts, developer tools, prompt sharing, collaborative platform, software prompts, development best practices, prompt creation, coding prompts, deployment prompts, community-driven development, cloud development tools, generative AI prompts",
  robots: "index, follow",
  metadataBase: new URL("https://promptz.dev"),
  openGraph: {
    type: "website",
    url: "https://promptz.dev",
    title:
      "PROMPTZ - Discover, Create, and Share Prompts for Amazon Q Developer",
    description:
      "Explore a rich library of prompts for Amazon Q Developer, share your own, and collaborate with the community.",
    siteName: "PROMPTZ",
    images: [
      {
        url: "https://promptz.dev/images/og-image.png",
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="icon"
          type="image/png"
          href="/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <ConfigureAmplifyClientSide />
          <div className="max-w-7xl mx-auto px-4">
            <TopNav />
          </div>
          <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/20 to-black overflow-hidden">
            <div className="max-w-7xl mx-auto px-4">{children}</div>
          </div>
          <Toaster />

          <Footer />
        </ThemeProvider>
        {/* <AuthProvider>
          <TopNav />
          <Suspense>{children}</Suspense>
          <Footer />
        </AuthProvider> */}
      </body>
    </html>
  );
}
