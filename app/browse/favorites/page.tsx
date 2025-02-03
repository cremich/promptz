"use client";

import {
  BreadcrumbGroup,
  ContentLayout,
  Header,
} from "@cloudscape-design/components";
import { useAuth } from "@/contexts/AuthContext";
import FavoritePromptCollection from "@/components/FavoritePromptCollection";

export default function Favorites() {
  const { user } = useAuth();

  return (
    <ContentLayout
      defaultPadding
      breadcrumbs={
        <BreadcrumbGroup
          items={[
            { text: "Promptz", href: "/" },
            { text: "Favorites", href: "favorites" },
          ]}
          ariaLabel="Breadcrumbs"
        />
      }
      header={
        <Header
          variant="h1"
          description="Your collection of favorite prompts that you have starred."
        >
          Favorite Prompts
        </Header>
      }
    >
      {user && (
        <FavoritePromptCollection
          promptsPerRow={[{ cards: 1 }, { minWidth: 800, cards: 4 }]}
        />
      )}
    </ContentLayout>
  );
}
