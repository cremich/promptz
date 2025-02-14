"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "@aws-amplify/auth";

export default function LogoutButton() {
  return (
    <Button
      data-testid="logout-button"
      className="w-full"
      onClick={() => {
        signOut();
      }}
    >
      Sign out
    </Button>
  );
}
