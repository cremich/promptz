"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { User, ChevronDown } from "lucide-react";
import LogoutButton from "@/app/ui/navigation/logout-button";
import { fetchCurrentUser } from "@/app/lib/actions/cognito";
import { useEffect, useState } from "react";
import LoginMenu from "@/app/ui/navigation/login-menu";
import { Hub } from "aws-amplify/utils";

export default function UserMenu() {
  const [user, setUser] = useState({ displayName: "", guest: true });

  Hub.listen("auth", ({ payload }) => {
    switch (payload.event) {
      case "signedIn":
        fetchUser();
        break;
      case "signedOut":
        setUser({ displayName: "", guest: true });
        break;
    }
  });

  const fetchUser = async () => {
    const currentUser = await fetchCurrentUser();
    setUser(currentUser);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div>
      {user && user.guest ? (
        <LoginMenu />
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center text-sm font-medium"
            >
              <User className="mr-2 h-4 w-4" />
              <span>{user.displayName}</span>
              <ChevronDown className="ml-1 h-4 w-4" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>
              <LogoutButton />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
