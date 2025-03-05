"use client";
import { Prompt, User } from "@/app/lib/definitions";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { generateClient } from "aws-amplify/api";
import { Schema } from "@/amplify/data/resource";
import { useRouter } from "next/navigation";

const appsync = generateClient<Schema>();

export default function StarPromptButton({
  prompt,
  user,
  starred,
}: {
  prompt: Prompt;
  user: User;
  starred: boolean;
}) {
  const [isStarred, setIsStarred] = useState(starred);
  const router = useRouter();
  async function handleClick() {
    if (user.guest) {
      router.push("/login");
    } else if (isStarred) {
      await appsync.models.stars.delete(
        {
          userId: user.id,
          promptId: prompt.id!,
        },
        {
          authMode: "userPool",
        },
      );
      setIsStarred(isStarred ? false : true);
      toast("Prompt removed from your favorites");
    } else {
      await appsync.models.stars.create(
        {
          userId: user.id,
          promptId: prompt.id!,
        },
        {
          authMode: "userPool",
        },
      );
      setIsStarred(isStarred ? false : true);
      toast("Prompt added to your favorites");
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className={
        `border-gray-800 text-white hover:bg-violet-700` +
        (isStarred ? " bg-violet-700" : "")
      }
      onClick={handleClick}
    >
      <Heart className="h-4 w-4" />
    </Button>
  );
}
