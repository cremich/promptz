import { useState, useEffect } from "react";
import { PromptGraphQLRepository } from "@/repositories/PromptRepository";
import { PromptViewModel } from "@/models/PromptViewModel";

const repository = new PromptGraphQLRepository();

export function usePromptCollection(limit?: number) {
  const [prompts, setPrompts] = useState<Array<PromptViewModel>>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const [nextToken, setNextToken] = useState<string | undefined>();
  const [hasMore, setHasMore] = useState<boolean>(false);

  useEffect(() => {
    loadPrompts();
  }, []);

  const loadPrompts = async () => {
    try {
      const promptList = await repository.listPrompts(limit);
      setLoading(false);
      setPrompts(promptList.prompts);
      if (promptList.nextToken) {
        setNextToken(promptList.nextToken);
        setHasMore(true);
      }
    } catch (error) {
      setError(error as Error);
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    try {
      setLoading(true);
      const promptList = await repository.listPrompts(limit, nextToken);
      setPrompts([...prompts, ...promptList.prompts]);
      if (promptList.nextToken) {
        setNextToken(promptList.nextToken);
        setHasMore(true);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  return { prompts, error, loading, hasMore, handleLoadMore };
}
