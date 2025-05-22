import { ModelType } from "@/lib/forms/schema-definitions";
import CopyClipBoardButton from "@/components/common/copy-clipboard";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface PromptInstructionProps {
  promptId: string;
  title: string;
  text: string;
  icon: LucideIcon;
}

export default function PromptInstruction({
  promptId,
  title,
  text,
  icon: Icon,
}: PromptInstructionProps) {
  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-6 w-6 text-violet-400" />
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        <CopyClipBoardButton
          id={promptId}
          type={ModelType.PROMPT}
          text={text}
          showButtonText={true}
        />
      </CardHeader>
      <CardContent>
        <pre className="text-gray-400">{text}</pre>
      </CardContent>
    </Card>
  );
}
