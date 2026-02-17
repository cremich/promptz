import { cn } from '@/lib/utils'

interface ProgressIndicatorProps {
  completed: number
  total: number
}

/**
 * Displays a progress bar with completed/total count.
 * Uses a simple styled div since Shadcn Progress is not available.
 */
export function ProgressIndicator({ completed, total }: ProgressIndicatorProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          <span className="font-semibold text-foreground">{completed}</span> of{' '}
          <span className="font-semibold text-foreground">{total}</span> completed
        </span>
        <span className="font-medium text-muted-foreground">{percentage}%</span>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={completed}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`${completed} of ${total} scenarios completed`}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-in-out',
            'bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
