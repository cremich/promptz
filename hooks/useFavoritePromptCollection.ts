import { useState, useEffect } from "react";
import { PromptViewModel } from "@/models/PromptViewModel";
import { UserGraphQLRepository } from "@/repositories/UserRepository";
import { useAuth } from "@/contexts/AuthContext";

const repository = new UserGraphQLRepository();

export function useFavoritePromptsCollection() {
  const [prompts, setPrompts] = useState<Array<PromptViewModel>>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadPrompts();
  }, [user]);

  const loadPrompts = async () => {
    try {
      if (user) {
        const promptList = await repository.getFavoritePrompts(user.id);
        setLoading(false);
        setPrompts([...prompts, ...promptList.prompts]);
      }
    } catch (error) {
      setError(error as Error);
      setLoading(false);
    }
  };

  return {
    prompts,
    error,
    loading,
  };
}
