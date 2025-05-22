import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface AttributeProps {
  title: string;
  text: string;
  icon: LucideIcon;
}

export default function PromptHowTo({
  title,
  text,
  icon: Icon,
}: AttributeProps) {
  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center gap-2">
        <Icon className="h-6 w-6 text-violet-400" />
        <h2 className="text-xl font-semibold">{title}</h2>
      </CardHeader>
      <CardContent>
        <div className="text-neutral-400 text-sm whitespace-pre-wrap">
          {text}
        </div>
      </CardContent>
    </Card>
  );
}
