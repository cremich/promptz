// components/TopNav.tsx

"use client";

import {
  TopNavigation,
  TopNavigationProps,
} from "@cloudscape-design/components";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function TopNav() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const getUtilities = (): TopNavigationProps.Utility[] => {
    const utilities: TopNavigationProps.Utility[] = [
      {
        type: "button",
        text: "Browse",
        href: "/browse",
      },
    ];

    if (user && !user.isGuest) {
      utilities.push({
        type: "button",
        text: "My Favorites",
        href: "/browse/favorites",
      });
      utilities.push({
        type: "button",
        text: "My Prompts",
        href: "/browse/my",
      });
      utilities.push({
        type: "button",
        text: "My Drafts",
        href: "/prompt/drafts",
      });
    }

    utilities.push({
      type: "button",
      text: "Feedback",
      external: true,
      href: "https://github.com/cremich/promptz/issues",
    });

    if (user && !user.isGuest) {
      utilities.push({
        type: "button",
        text: "Sign Out",
        onClick: async () => {
          await logout();
          router.push("/");
        },
      });
    } else {
      utilities.push({
        type: "button",
        text: "Sign In",
        href: "/auth",
      });
    }

    return utilities;
  };

  return (
    <TopNavigation
      i18nStrings={{ overflowMenuTriggerText: "More" }}
      identity={{
        href: "/",
        title: "Promptz",
        logo: {
          src: "/images/promptz_logo.png",
          alt: "Amazon Q Developer Logo",
        },
      }}
      utilities={getUtilities()}
    />
  );
}
