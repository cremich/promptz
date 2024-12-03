"use client";
import {
  BreadcrumbGroup,
  ContentLayout,
  Header,
} from "@cloudscape-design/components";

import PromptForm, { PromptFormInputs } from "@/components/PromptForm";
import { PromptViewModel } from "@/models/PromptViewModel";
import { SubmitHandler } from "react-hook-form";
import { PromptGraphQLRepository } from "@/repositories/PromptRepository";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { LocalStorageDraftRepository } from "@/repositories/DraftRepository";

const repository = new PromptGraphQLRepository();
const draftRepository = new LocalStorageDraftRepository();

export default function CreatePrompt() {
  const { user } = useAuth();
  const router = useRouter();
  const newPrompt = new PromptViewModel();

  const savePrompt: SubmitHandler<PromptFormInputs> = async (data) => {
    const draftPromptId = newPrompt.id;
    await newPrompt.publish(data, user!, repository);
    draftRepository.deleteDraft(draftPromptId);

    router.push(`/prompt/${newPrompt.id}`);
  };

  const saveDraft = (formInputs: PromptFormInputs) => {
    newPrompt.saveDraft(formInputs, draftRepository);
  };

  return (
    <ContentLayout
      defaultPadding
      headerVariant="high-contrast"
      maxContentWidth={2048}
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
        <Header
          variant="h1"
          description="Create a new prompt or prompt template"
        >
          New Prompt
        </Header>
      }
    >
      <PromptForm
        prompt={newPrompt}
        onSubmit={savePrompt}
        onSaveDraft={saveDraft}
      />
    </ContentLayout>
  );
}
