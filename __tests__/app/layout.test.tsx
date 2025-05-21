import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import RootLayout, { metadata, viewport } from "@/app/layout";

// Mock child components
jest.mock("@/components/layout/navigation/topnav", () => {
  return function TopNav() {
    return <div data-testid="topnav-mock">TopNav Mock</div>;
  };
});

jest.mock("@/components/layout/theme-provider", () => {
  return {
    ThemeProvider: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="theme-provider-mock">{children}</div>
    ),
  };
});

jest.mock("@/components/amplify/configure-amplify", () => {
  return function ConfigureAmplifyClientSide() {
    return (
      <div data-testid="configure-amplify-mock">Configure Amplify Mock</div>
    );
  };
});

jest.mock("@/components/layout/footer", () => {
  return function Footer() {
    return <div data-testid="footer-mock">Footer Mock</div>;
  };
});

jest.mock("@/components/ui/sonner", () => {
  return {
    Toaster: function Toaster() {
      return <div data-testid="toaster-mock">Toaster Mock</div>;
    },
  };
});

describe("Root Layout", () => {
  describe("Metadata", () => {
    test("Has correct title", () => {
      expect(metadata.title).toBe(
        "PROMPTZ - Discover, Create, and Share Prompts for Amazon Q Developer",
      );
    });

    test("Has correct description", () => {
      expect(metadata.description).toContain(
        "Simplify prompt engineering for Amazon Q Developer",
      );
    });

    test("Has correct keywords", () => {
      expect(metadata.keywords).toContain("promptz");
      expect(metadata.keywords).toContain("Amazon Q Developer");
    });

    test("Has correct robots setting", () => {
      expect(metadata.robots).toBe("index, follow");
    });

    test("Has correct metadataBase URL", () => {
      expect(metadata.metadataBase?.toString()).toBe("https://promptz.dev/");
    });

    test("Has correct OpenGraph properties", () => {
      // expect(metadata.openGraph?.type).toBe("website");
      expect(metadata.openGraph?.url).toBe("https://promptz.dev");
      expect(metadata.openGraph?.title).toContain("PROMPTZ");
      expect(metadata.openGraph?.siteName).toBe("PROMPTZ");
      // expect(metadata.openGraph?.images?.[0].url).toBe("https://promptz.dev/images/og-image.png");
    });
  });

  describe("Viewport", () => {
    test("Has correct viewport settings", () => {
      expect(viewport.width).toBe("device-width");
      expect(viewport.initialScale).toBe(1);
    });
  });

  test("Renders with correct language attribute", () => {
    render(
      <RootLayout>
        <div data-testid="child-content">Test Content</div>
      </RootLayout>,
    );

    const html = document.documentElement;
    expect(html).toHaveAttribute("lang", "en");
  });

  test("Renders favicon and manifest links", () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>,
    );

    // Check for favicon links
    const faviconLinks = document.querySelectorAll('link[rel="icon"]');
    expect(faviconLinks).toHaveLength(2);

    // Check for manifest link
    const manifestLink = document.querySelector('link[rel="manifest"]');
    expect(manifestLink).toBeInTheDocument();
    expect(manifestLink).toHaveAttribute("href", "/site.webmanifest");

    // Check for apple touch icon
    const appleTouchIcon = document.querySelector(
      'link[rel="apple-touch-icon"]',
    );
    expect(appleTouchIcon).toBeInTheDocument();
    expect(appleTouchIcon).toHaveAttribute("href", "/apple-touch-icon.png");
  });

  test("Renders all layout components", () => {
    render(
      <RootLayout>
        <div data-testid="child-content">Test Content</div>
      </RootLayout>,
    );

    // Check for mocked components
    expect(screen.getByTestId("topnav-mock")).toBeInTheDocument();
    expect(screen.getByTestId("theme-provider-mock")).toBeInTheDocument();
    expect(screen.getByTestId("configure-amplify-mock")).toBeInTheDocument();
    expect(screen.getByTestId("footer-mock")).toBeInTheDocument();
    expect(screen.getByTestId("toaster-mock")).toBeInTheDocument();
  });

  test("Renders children content", () => {
    render(
      <RootLayout>
        <div data-testid="child-content">Test Content</div>
      </RootLayout>,
    );

    expect(screen.getByTestId("child-content")).toBeInTheDocument();
    expect(screen.getByTestId("child-content")).toHaveTextContent(
      "Test Content",
    );
  });

  test("Applies font classes to body", () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>,
    );

    const body = document.body;
    expect(body.className).toContain("antialiased");
    // Note: We can't directly test the dynamic class names from geistSans.variable and geistMono.variable
    // as they are generated at runtime, but we can check that the className contains "variable"
    expect(body.className).toMatch(/variable/);
  });
});
