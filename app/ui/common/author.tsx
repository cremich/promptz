import { CircleUserRound } from "lucide-react";

interface AuthorProps {
  name: string;
}

export default function Author(props: AuthorProps) {
  return (
    <div className="flex items-center space-x-4">
      <CircleUserRound />
      <div className="text-sm">
        <p className="font-medium">@{props.name}</p>
        <p className="text-muted-foreground">Author</p>
      </div>
    </div>
  );
}
