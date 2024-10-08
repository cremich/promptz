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
} from "@cloudscape-design/components";
import { generateClient } from "aws-amplify/api";
import type { Schema } from "../amplify/data/resource";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCurrentUser } from "aws-amplify/auth";

interface PromptProps {
  promptId: string;
}

const client = generateClient<Schema>();

export default function Prompt(props: PromptProps) {
  const router = useRouter();

  const [prompt, setPrompt] = useState<Schema["prompt"]["type"]>();
  const [isOwnedByCurrentUser, setOwnedByCurrentUser] = useState(false);
  useEffect(() => {
    loadPrompt(props.promptId);
  }, []);

  const loadPrompt = async (promptId: string) => {
    const { userId } = await getCurrentUser();
    const { data: prompt } = await client.models.prompt.get({ id: promptId });
    if (prompt) {
      setPrompt(prompt);
      userId === prompt.owner
        ? setOwnedByCurrentUser(true)
        : setOwnedByCurrentUser(false);
    }
  };

  if (!prompt)
    return (
      <Container>
        <Box textAlign="center">
          <Spinner size="large" />
        </Box>
      </Container>
    );

  return (
    <Container
      header={
        <Header
          variant="h2"
          description={prompt?.description}
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <CopyToClipboard
                copyButtonText="Copy"
                copyErrorText="Prompt failed to copy"
                copySuccessText=" Prompt copied. Now, go build!"
                textToCopy={prompt?.instruction}
              />
              {isOwnedByCurrentUser ? (
                <Button
                  variant="primary"
                  onClick={() => router.push(`/prompt/${prompt.id}/edit`)}
                >
                  Edit
                </Button>
              ) : (
                ""
              )}
            </SpaceBetween>
          }
        >
          <SpaceBetween size="xs" direction="horizontal">
            <Badge color="blue">{prompt.sdlc_phase?.toLocaleUpperCase()}</Badge>
            <Badge>{prompt.category}</Badge>
            <Link href={`/prompt/${prompt.id}`} fontSize="heading-s">
              {prompt.name}
            </Link>
          </SpaceBetween>
        </Header>
      }
      footer={
        <SpaceBetween size="xs" direction="horizontal">
          <Box float="left">
            <Icon name="user-profile" /> created by {prompt.owner_username}
          </Box>
        </SpaceBetween>
      }
    >
      <pre className="wrap">{prompt.instruction}</pre>
    </Container>
  );
}
