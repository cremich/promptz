"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { User, ChevronDown, Heart, FileText } from "lucide-react";
import LogoutButton from "@/app/ui/navigation/logout-button";
import { fetchCurrentUser } from "@/app/lib/actions/cognito";
import { useEffect, useState } from "react";
import LoginMenu from "@/app/ui/navigation/login-menu";
import { Hub } from "aws-amplify/utils";
import Link from "next/link";

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
            <DropdownMenuItem asChild>
              <Link
                href="/prompts/favorites"
                className="flex items-center w-full cursor-pointer"
              >
                <Heart className="mr-2 h-4 w-4" />
                <span>Favorites</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/prompts/my"
                className="flex items-center w-full cursor-pointer"
              >
                <FileText className="mr-2 h-4 w-4" />
                <span>My Prompts</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/rules/my"
                className="flex items-center w-full cursor-pointer"
              >
                <FileText className="mr-2 h-4 w-4" />
                <span>My Rules</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogoutButton />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
