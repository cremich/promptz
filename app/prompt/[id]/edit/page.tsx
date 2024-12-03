"use client";
import {
  Alert,
  Box,
  BreadcrumbGroup,
  Button,
  Container,
  ContentLayout,
  Header,
  Modal,
  SpaceBetween,
  Spinner,
} from "@cloudscape-design/components";
import PromptForm, { PromptFormInputs } from "@/components/PromptForm";
import { useRouter } from "next/navigation";
import { SubmitHandler } from "react-hook-form";
import { useAuth } from "@/contexts/AuthContext";
import { PromptGraphQLRepository } from "@/repositories/PromptRepository";
import { useState } from "react";
import { LocalStorageDraftRepository } from "@/repositories/DraftRepository";
import { useDraft } from "@/hooks/useDraft";

const repository = new PromptGraphQLRepository();
const draftRepository = new LocalStorageDraftRepository();

export default function EditPrompt({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const router = useRouter();
  const { promptViewModel, error, loading } = useDraft(params.id);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [processing, setProcessing] = useState(false);

  const savePrompt: SubmitHandler<PromptFormInputs> = async (data) => {
    const draftPromptId = promptViewModel!.id;
    await promptViewModel!.publish(data, user!, repository);

    draftRepository.deleteDraft(draftPromptId);
    router.push(`/prompt/${promptViewModel!.id}`);
  };

  const saveDraft = (formInputs: PromptFormInputs) => {
    promptViewModel!.saveDraft(formInputs, draftRepository);
  };

  const handleDelete = () => {
    setDeleteModalVisible(true);
  };

  const deletePrompt = async () => {
    setProcessing(true);
    try {
      await promptViewModel!.delete(user!, repository);
      router.push("/browse/my");
    } finally {
      setProcessing(false);
    }
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
            { text: `${params.id.substring(0, 7)}...`, href: `/${params.id}` },
            { text: "Edit", href: "#" },
          ]}
          ariaLabel="Breadcrumbs"
        />
      }
      header={
        <Header variant="h1" description="Engineer your prompts">
          Edit your Prompt
        </Header>
      }
    >
      {loading && (
        <Container data-testing="loading">
          <Box textAlign="center">
            <Spinner size="large" />
          </Box>
        </Container>
      )}

      {error && (
        <SpaceBetween size="l" data-testing="error">
          <Alert
            statusIconAriaLabel="Error"
            type="error"
            header={error.name}
            data-testing="error"
          >
            {error.message}
          </Alert>
        </SpaceBetween>
      )}

      {promptViewModel && (
        <PromptForm
          prompt={promptViewModel}
          onSubmit={savePrompt}
          onDelete={handleDelete}
          onSaveDraft={saveDraft}
        />
      )}

      <Modal
        onDismiss={() => setDeleteModalVisible(false)}
        visible={deleteModalVisible}
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button
                variant="link"
                data-testid="button-remove-cancel"
                onClick={() => setDeleteModalVisible(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={deletePrompt}
                loading={processing}
                data-testid="button-remove-confirm"
              >
                Yes, delete the prompt
              </Button>
            </SpaceBetween>
          </Box>
        }
        header="Delete prompt"
      >
        Permanently delete this prompt? This action cannot be undone.
      </Modal>
    </ContentLayout>
  );
}
