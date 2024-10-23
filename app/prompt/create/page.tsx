"use client";
import { BreadcrumbGroup, ContentLayout, Header } from "@cloudscape-design/components";

import PromptForm from "@/components/PromptForm";
import { PromptViewModel } from "@/models/PromptViewModel";

export default function CreatePrompt() {
  return (
    <ContentLayout
      defaultPadding
      headerVariant="high-contrast"
      maxContentWidth={1024}
      breadcrumbs={
        <BreadcrumbGroup
          items={[
            { text: "Promptz", href: "/" },
            { text: "Prompts & Prompt Templates", href: "/browse" },
            { text: "Create", href: "#" },
          ]}
          ariaLabel="Breadcrumbs"
        />
      }
      header={
        <Header variant="h1" description="Create a new prompt or prompt template">
          New Prompt
        </Header>
      }
    >
      <PromptForm prompt={new PromptViewModel()} />
    </ContentLayout>
  );
}
