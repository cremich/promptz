import { ProjectRule } from "@/lib/models/project-rule-model";
import Author from "@/components/common/author";
import Tags from "@/components/common/tags";
import { Flame, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import Link from "next/link";

interface ProjectRuleCardProps {
  projectRule: ProjectRule;
}

function GetPopularityBadge(copyCount: number) {
  if (copyCount >= 100)
    return { label: "Hot", color: "bg-red-500 hover:bg-red-600" };
  if (copyCount >= 50)
    return { label: "Trending", color: "bg-orange-500 hover:bg-orange-600" };
  return null;
}

export default function ProjectRuleCard({ projectRule }: ProjectRuleCardProps) {
  const popularityBadge = projectRule.copyCount
    ? GetPopularityBadge(projectRule.copyCount)
    : null;

  return (
    <Link
      href={`/rules/rule/${projectRule.slug}`}
      aria-label={`Show ${projectRule.title}`}
    >
      <Card
        key={projectRule.id}
        className="h-full bg-gradient-to-br from-neutral-800 to-neutral-900 border-neutral-700 hover:border-violet-500/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-violet-500/20"
        data-testid="project-rule-card"
      >
        <CardHeader className="pb-1">
          <div className="space-y-4">
            {popularityBadge && (
              <Badge className={`${popularityBadge.color} text-white text-xs`}>
                <Flame className="w-3 h-3 mr-1" />
                {popularityBadge.label}
              </Badge>
            )}
            {projectRule.tags && <Tags tags={projectRule.tags} />}
            <CardTitle className="text-lg font-semibold text-white group-hover:text-violet-300 transition-colors">
              {projectRule.title}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-muted-foreground">{projectRule.description}</p>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          {projectRule.author && <Author name={projectRule.author} />}
          {projectRule.copyCount !== undefined && (
            <div className="flex items-center text-muted-foreground text-sm">
              <Copy className="w-4 h-4 mr-1" />
              <span>{projectRule.copyCount.toLocaleString()} times copied</span>
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
