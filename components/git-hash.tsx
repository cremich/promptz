import { getShortHash } from "@/lib/formatter/git"
import type { GitInfo } from "@/lib/types/content"

interface GitHashProps {
  git?: GitInfo
  className?: string
}

export function GitHash({ git, className }: GitHashProps) {
  if (!git?.commitHash) {
    return null
  }

  return (
    <span className={`font-mono ${className || ""}`}>
      {getShortHash(git.commitHash)}
    </span>
  )
}