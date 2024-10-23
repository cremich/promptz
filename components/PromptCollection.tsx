"use client";

import {
  SpaceBetween,
  Button,
  Container,
  Box,
  Link,
  Cards,
  CardsProps,
  Badge,
  Icon,
  Alert,
  Pagination,
} from "@cloudscape-design/components";
import { useRouter } from "next/navigation";
import { usePromptCollection } from "../hooks/usePromptCollection";

interface PromptCollectionProps {
  limit?: number;
  promptsPerRow?: CardsProps.CardsLayout[];
}

export default function PromptCollection(props: PromptCollectionProps) {
  const router = useRouter();
  const { prompts, error, loading, hasMore, handleLoadMore } = usePromptCollection(props.limit);

  if (error)
    return (
      <Alert statusIconAriaLabel="Error" type="error" header={error.name} data-testing="error">
        {error.message}
      </Alert>
    );

  return (
    <SpaceBetween size="s">
      <Cards
        variant="container"
        cardDefinition={{
          header: (item) => (
            <SpaceBetween size="xs">
              <SpaceBetween size="xs" direction="horizontal">
                <Badge color="blue">{item.sdlcPhase}</Badge>
                <Badge color="grey">{item.category}</Badge>
              </SpaceBetween>
              <Link href={`/prompt/${item.id}`} fontSize="heading-s">
                {item.name}
              </Link>
            </SpaceBetween>
          ),
          sections: [
            {
              id: "owner_username",
              content: (item) => (
                <Box>
                  <Icon name="user-profile" /> {item.createdBy()}
                </Box>
              ),
            },
            {
              id: "description",
              content: (item) => item.description,
            },
          ],
        }}
        cardsPerRow={props.promptsPerRow ?? [{ cards: 1 }]}
        items={prompts}
        loading={loading}
        loadingText="Loading a world of prompts"
        empty={
          <Container>
            <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
              <SpaceBetween size="m">
                <b>No prompts created yet</b>
                <Button onClick={() => router.push("/prompt/create")}>Be the first. Create a prompt.</Button>
              </SpaceBetween>
            </Box>
          </Container>
        }
      />

      {prompts.length > 0 && (
        <Box textAlign="center">
          <Button
            disabled={!hasMore}
            disabledReason="Congrats. You reached the end of Promptz."
            loading={loading}
            onClick={() => handleLoadMore()}
          >
            Load more
          </Button>
        </Box>
      )}
    </SpaceBetween>
  );
}
