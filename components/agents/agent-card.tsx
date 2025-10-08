import { Agent } from "@/lib/models/agent-model";
import Author from "@/components/common/author";
import Tags from "@/components/common/tags";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import Link from "next/link";

interface AgentCardProps {
  agent: Agent;
}

export default function AgentCard({ agent }: AgentCardProps) {
  return (
    <Link
      href={`/agents/agent/${agent.slug}`}
      aria-label={`Show ${agent.name}`}
    >
      <Card
        key={agent.id}
        className="h-full bg-gradient-to-br from-neutral-800 to-neutral-900 border-neutral-700 hover:border-violet-500/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-violet-500/20"
        data-testid="agent-card"
      >
        <CardHeader className="pb-1">
          <div className="space-y-4">
            {agent.tags && <Tags tags={agent.tags} />}
            <CardTitle className="text-lg font-semibold text-white group-hover:text-violet-300 transition-colors">
              {agent.name}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-muted-foreground">{agent.description}</p>
          {agent.tools && agent.tools.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {agent.tools.slice(0, 3).map((tool) => (
                <Badge
                  key={tool}
                  variant="secondary"
                  className="text-xs bg-neutral-700 text-neutral-300"
                >
                  {tool}
                </Badge>
              ))}
              {agent.tools.length > 3 && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-neutral-700 text-neutral-300"
                >
                  +{agent.tools.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          {agent.author && <Author name={agent.author} />}
        </CardFooter>
      </Card>
    </Link>
  );
}
