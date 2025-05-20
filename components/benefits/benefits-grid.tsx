import BenefitCard from "@/components/benefits/benefits-card";
import { BookOpen, Code, Github, Users } from "lucide-react";

export default function BenefitsGrid() {
  return (
    <section className="w-full">
      <div className="px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Why Promptz?
            </h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              The perfect prompt is just one click away!
            </p>
          </div>
        </div>
        <p className="mt-4 text-center max-w-4xl mx-auto text-zinc-400 mb-12">
          PROMPTZ is your ultimate resource for Amazon Q Developer prompt
          engineering. Discover, create, and share high-quality prompts to
          tackle real-world software development challenges. From generating AWS
          architecture blueprints to automating workflows and beyond, PROMPTZ
          empowers developers to get the most out of Amazon Q Developer with a
          rich library of prompt templates and community contributions.
        </p>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <BenefitCard
            icon={Code}
            title="Ready-to-Use Solutions"
            content=" Simplify software development with our curated collection of
              production-ready prompt templates"
          />
          <BenefitCard
            icon={Users}
            title="Community Collaboration"
            content="Join a vibrant community to refine and share your prompt engineering ideas"
          />
          <BenefitCard
            icon={BookOpen}
            title="Best Practices"
            content="Learn prompt engineering best practices for every stage of the
              software development lifecycle"
          />
        </div>

        <div className="mt-12 max-w-2xl mx-auto">
          <BenefitCard
            icon={Github}
            title="Contribute to PROMPTZ"
            content="PROMPTZ is a community-first platform. The source code is open on
            GitHub, and we welcome contributions from developers and
            enthusiasts. If you want to share your ideas, join us on Github."
            cta={{
              href: "https://github.com/cremich/promptz",
              text: "Join on GitHub",
            }}
          />
        </div>
      </div>
    </section>
  );
}
