import { ProjectRule } from "@/lib/models/project-rule-model";
import Author from "@/components/common/author";
import Tags from "@/components/common/tags";
import { Flame, Copy, Download } from "lucide-react";
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

function GetPopularityBadge(totalPopularity: number) {
  if (totalPopularity >= 100)
    return { label: "Hot", color: "bg-red-500 hover:bg-red-600" };
  if (totalPopularity >= 50)
    return { label: "Trending", color: "bg-orange-500 hover:bg-orange-600" };
  return null;
}

function CalculatePopularity(projectRule: ProjectRule): number {
  const copyCount = projectRule.copyCount || 0;
  const downloadCount = projectRule.downloadCount || 0;
  return copyCount + downloadCount;
}

export default function ProjectRuleCard({ projectRule }: ProjectRuleCardProps) {
  const totalPopularity = CalculatePopularity(projectRule);
  const popularityBadge =
    totalPopularity > 0 ? GetPopularityBadge(totalPopularity) : null;

  return (
    <Link
      href={`/rules/rule/${projectRule.slug}`}
      aria-label={`Show ${projectRule.name}`}
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
              {projectRule.name}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-muted-foreground">{projectRule.description}</p>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          {projectRule.author && <Author name={projectRule.author} />}
          <div className="flex items-center gap-4 text-muted-foreground text-sm">
            {projectRule.copyCount !== undefined && (
              <div className="flex items-center">
                <Copy className="w-4 h-4 mr-1" />
                <span>
                  {projectRule.copyCount.toLocaleString()} times copied
                </span>
              </div>
            )}
            {projectRule.downloadCount !== undefined && (
              <div className="flex items-center">
                <Download className="w-4 h-4 mr-1" />
                <span>
                  {projectRule.downloadCount.toLocaleString()} downloads
                </span>
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
