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
} from "@cloudscape-design/components";

import { useRouter } from "next/navigation";
import { useFavoritePromptsCollection } from "@/hooks/useFavoritePromptCollection";

interface PromptCollectionProps {
  promptsPerRow?: CardsProps.CardsLayout[];
}

export default function FavoritePromptCollection(props: PromptCollectionProps) {
  const { prompts, loading } = useFavoritePromptsCollection();
  const router = useRouter();

  return (
    <SpaceBetween size="s">
      <Cards
        variant="full-page"
        cardDefinition={{
          header: (item) => (
            <SpaceBetween size="xs">
              <SpaceBetween size="xs" direction="horizontal">
                <Badge color="green">{item.interface}</Badge>
                <Badge color="grey">{item.category}</Badge>
              </SpaceBetween>
              <Link href={`/prompt/${item.id}`} fontSize="heading-s">
                {item.name}
              </Link>
            </SpaceBetween>
          ),
          sections: [
            {
              id: "description",
              content: (item) => item.description,
            },
          ],
        }}
        cardsPerRow={props.promptsPerRow ?? [{ cards: 1 }]}
        items={prompts}
        loading={loading}
        loadingText="Loading your favorite prompts."
        empty={
          <Container>
            <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
              <SpaceBetween size="m">
                <b>No prompts marked as favorites.</b>
                <Button
                  data-testid="button-browse"
                  onClick={() => router.push("/browse")}
                >
                  Wanna change this? Browse the prompt library.
                </Button>
              </SpaceBetween>
            </Box>
          </Container>
        }
      />
    </SpaceBetween>
  );
}
