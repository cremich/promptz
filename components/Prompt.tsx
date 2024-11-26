// components/Logout.tsx

"use client";

import {
  SpaceBetween,
  Button,
  Container,
  Header,
  Box,
  CopyToClipboard,
  Spinner,
  Badge,
  Link,
  Icon,
  Alert,
} from "@cloudscape-design/components";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { usePrompt } from "@/hooks/usePrompt";

interface PromptProps {
  promptId: string;
}

export default function Prompt(props: PromptProps) {
  const router = useRouter();
  const { promptViewModel, error, loading } = usePrompt(props.promptId);
  const { user } = useAuth();

  if (loading)
    return (
      <Container data-testid="container-loading">
        <Box textAlign="center">
          <Spinner size="large" />
        </Box>
      </Container>
    );

  if (error)
    return (
      <Alert
        data-testid="alert-error"
        statusIconAriaLabel="Error"
        type="error"
        header={error.name}
        data-testing="error"
      >
        {error.message}
      </Alert>
    );

  if (promptViewModel)
    return (
      <Container
        header={
          <Header
            variant="h2"
            description={promptViewModel.description}
            actions={
              <SpaceBetween direction="horizontal" size="xs">
                <CopyToClipboard
                  data-testid="button-copy"
                  copyButtonText="Copy"
                  copyErrorText="Prompt failed to copy"
                  copySuccessText=" Prompt copied. Now, go build!"
                  textToCopy={promptViewModel.instruction}
                />
                {user && !user.guest && promptViewModel.isOwnedBy(user) ? (
                  <Button
                    data-testid="button-edit"
                    variant="primary"
                    onClick={() =>
                      router.push(`/prompt/${promptViewModel.id}/edit`)
                    }
                  >
                    Edit
                  </Button>
                ) : (
                  ""
                )}
              </SpaceBetween>
            }
          >
            <Link href="#" fontSize="heading-s">
              {promptViewModel.name}
            </Link>
          </Header>
        }
        footer={
          <SpaceBetween size="xs" direction="horizontal">
            <Box float="left">
              <Icon name="user-profile" /> {promptViewModel.createdBy()}
            </Box>
          </SpaceBetween>
        }
      >
        <SpaceBetween alignItems="start" direction="vertical" size="xs">
          {promptViewModel.howto && promptViewModel.howto.length > 0 && (
            <div>
              <Box variant="awsui-key-label">How to use this prompt:</Box>
              <Box data-testid="box-howto">{promptViewModel.howto}</Box>
            </div>
          )}
          <div>
            <Box variant="awsui-key-label">Instruction:</Box>
            <pre className="wrap">{promptViewModel.instruction}</pre>
          </div>
          <SpaceBetween alignItems="start" direction="horizontal" size="xs">
            <Badge color="blue">{promptViewModel.sdlcPhase}</Badge>
            <Badge color="green">{promptViewModel.interface}</Badge>
            <Badge color="grey">{promptViewModel.category}</Badge>
          </SpaceBetween>
        </SpaceBetween>
      </Container>
    );
}
