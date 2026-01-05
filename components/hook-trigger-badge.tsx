import { Badge } from "@/components/ui/badge";

interface HookTriggerBadgeProps {
  trigger?: string;
  className?: string;
}

export function HookTriggerBadge({ trigger, className }: HookTriggerBadgeProps) {
  if (!trigger) return null;
  
  return (
    <Badge variant="secondary" className={`text-xs ${className || ''}`}>
      {trigger}
    </Badge>
  );
}