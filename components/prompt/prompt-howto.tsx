import { LucideIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    <div
      className="bg-gradient-to-r from-slate-900/50 to-gray-900/50 rounded-xl border border-slate-700/50"
      data-testid="prompt-howto-container"
    >
      {/* Header Section */}
      <div className="flex flex-row items-center gap-2 p-6 pb-3">
        <Icon className="h-6 w-6 text-violet-400" />
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>

      {/* Content Section */}
      <div className="p-6 pt-0">
        <ScrollArea className="h-96">
          <div className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
            {text}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
