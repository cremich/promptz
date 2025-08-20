import { ModelType } from "@/lib/forms/schema-definitions";
import CopyClipBoardButton from "@/components/common/copy-clipboard";
import { LucideIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    <div
      className="bg-gradient-to-r from-slate-900/50 to-gray-900/50 rounded-xl border border-slate-700/50"
      data-testid="prompt-instruction-container"
    >
      {/* Header Section */}
      <div className="flex flex-row items-center justify-between p-6 pb-3">
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
      </div>

      {/* Content Section */}
      <div className="p-6 pt-0">
        <ScrollArea className="h-50">
          <pre className="text-gray-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">
            {text}
          </pre>
        </ScrollArea>
      </div>
    </div>
  );
}
