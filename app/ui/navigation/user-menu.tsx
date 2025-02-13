import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { User, ChevronDown } from "lucide-react";
import { fetchCurrentAuthUser } from "@/app/lib/auth-server";
import LogoutButton from "@/app/ui/navigation/logout-button";

export type UserMenuProps = {
  displayName: string;
};

export default async function UserMenu(props: UserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center text-sm font-medium"
        >
          <User className="mr-2 h-4 w-4" />
          <span>{props.displayName}</span>
          <ChevronDown className="ml-1 h-4 w-4" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem>
          <LogoutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
