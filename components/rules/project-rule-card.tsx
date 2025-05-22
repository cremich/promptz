import { ProjectRule } from "@/lib/models/project-rule-model";
import Author from "@/components/common/author";
import Tags from "@/components/common/tags";
import { Card, CardHeader, CardFooter } from "@/components/ui/card";
import Link from "next/link";

interface ProjectRuleCardProps {
  projectRule: ProjectRule;
}

export default function ProjectRuleCard({ projectRule }: ProjectRuleCardProps) {
  return (
    <Card key={projectRule.id} className="flex flex-col">
      <CardHeader className="flex-1">
        <div className="space-y-4">
          {projectRule.tags && <Tags tags={projectRule.tags} />}

          <h3 className="font-semibold text-xl">
            <Link
              href={`/rules/rule/${projectRule.slug}`}
              className="hover:text-violet-500"
            >
              {projectRule.title}
            </Link>
          </h3>
          <p className="text-muted-foreground">{projectRule.description}</p>
        </div>
      </CardHeader>
      <CardFooter>
        {projectRule.author && <Author name={projectRule.author} />}
      </CardFooter>
    </Card>
  );
}
