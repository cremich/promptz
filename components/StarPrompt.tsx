"use client";

import { Button, ButtonProps } from "@cloudscape-design/components";
import { useEffect, useState } from "react";
import { PromptViewModel } from "@/models/PromptViewModel";
import { UserViewModel } from "@/models/UserViewModel";
import { StarGraphQLRepository } from "@/repositories/StarRepository";

interface StarPromptProps {
  prompt: PromptViewModel;
  user: UserViewModel;
  variant?: ButtonProps.Variant;
}

const repository = new StarGraphQLRepository();

/**
 * StarPrompt component allows users to star/unstar prompts
 * @param props Component properties including prompt and disabled state
 * @returns A button component with star/unstar functionality
 */
export default function StarPrompt(props: StarPromptProps) {
  const [isStarred, setIsStarred] = useState(props.prompt.isStarred);

  useEffect(() => {
    const loadStarState = async () => {
      try {
        const starredByUser = await repository.starredByUser(
          props.prompt,
          props.user,
        );
        setIsStarred(starredByUser);
      } catch {
        setIsStarred(false);
      }
    };
    loadStarState();
  }, [props.prompt, props.user]);

  const handleClick = async () => {
    if (isStarred) {
      props.prompt.unstar();
      repository.removeStar(props.prompt, props.user);
    } else {
      props.prompt.star();
      repository.addStar(props.prompt, props.user);
    }
    setIsStarred(props.prompt.isStarred);
  };

  return (
    <Button
      data-testid="button-star"
      variant={props.variant ? props.variant : "normal"}
      iconName={isStarred ? "star-filled" : "star"}
      onClick={handleClick}
      disabled={!props.user || props.user.isGuest ? true : false}
    >
      {isStarred ? "Remove from Favorites" : "Add to Favorites"}
    </Button>
  );
}
