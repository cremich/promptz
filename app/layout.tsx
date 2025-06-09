import ConfigureAmplifyClientSide from "@/components/amplify/configure-amplify";
import type { Metadata, Viewport } from "next";
import { geistMono, geistSans } from "@/components/layout/fonts";
import "@/app/globals.css";
import TopNav from "@/components/layout/navigation/topnav";
import { ThemeProvider } from "@/components/layout/theme-provider";
import Footer from "@/components/layout/footer";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title:
    "Akkodis Prompt Hub - Discover, Create, and Share Prompts for AI tools",
  description:
    "Simplify prompt engineering for AI tools with the ultimate prompt library for AI tools. Discover, create, and perfect prompts for AI tools. Explore a rich library of categorized prompts, share your own, and collaborate with the community to enhance your software development lifecycle. ",
  keywords:
    "akkodis, akkodis-prompt-hub, prompt, prompt engineering, Amazon Q Developer, prompt library, prompthub.aws.akkodis.com, software development lifecycle, SDLC prompts, developer tools, prompt sharing, collaborative platform, software prompts, development best practices, prompt creation, coding prompts, deployment prompts, community-driven development, cloud development tools, generative AI prompts",
  robots: "index, follow",
  metadataBase: new URL("https://prompthub.aws.akkodis.com"),
  openGraph: {
    type: "website",
    url: "https://prompthub.aws.akkodis.com",
    title:
      "Akkodis Prompt Hub - Discover, Create, and Share Prompts for AI tools",
    description:
      "Explore a rich library of prompts for AI tools, share your own, and collaborate with the community.",
    siteName: "Akkodis Prompt Hub",
    images: [
      {
        url: "https://prompthub.aws.akkodis.com/images/og-image.png",
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
          <div className="min-h-screen bg-gradient-to-b from-black via-cyan-950/50 to-black overflow-hidden">
            <div className="max-w-7xl mx-auto px-4">{children}</div>
          </div>
          <Toaster />

          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
