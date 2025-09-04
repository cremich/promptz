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
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Icon className="h-6 w-6 text-violet-400" />
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        {/* Content Section */}
        <ScrollArea className="h-50">
          <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-gray-300 ">
            {text}
          </pre>
        </ScrollArea>
      </div>
    </div>
  );
}
