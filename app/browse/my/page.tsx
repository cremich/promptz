"use client";

import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import { useRouter } from "next/navigation";
import {
  BreadcrumbGroup,
  Button,
  ContentLayout,
  Header,
} from "@cloudscape-design/components";
import PromptCollection from "@/components/PromptCollection";
import { useAuth } from "@/contexts/AuthContext";

Amplify.configure(outputs);

export default function Browse() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <ContentLayout
      defaultPadding
      breadcrumbs={
        <BreadcrumbGroup
          items={[
            { text: "Promptz", href: "/" },
            { text: "Browse", href: "/browse" },
            { text: "My Prompts", href: "my" },
          ]}
          ariaLabel="Breadcrumbs"
        />
      }
      header={
        <Header
          variant="h1"
          description="This is a list of your amazing contributions of prompts. You are awesome!"
          actions={
            <Button
              variant="primary"
              onClick={() => router.push("/prompt/create")}
            >
              Create Prompt
            </Button>
          }
        >
          Your prompts
        </Header>
      }
    >
      {user && (
        <PromptCollection
          showLoadMore={true}
          showFilters={false}
          limit={50}
          facets={[{ facet: "OWNER", value: `${user.id}::${user.username}` }]}
          promptsPerRow={[{ cards: 1 }, { minWidth: 800, cards: 4 }]}
        />
      )}
    </ContentLayout>
  );
}
