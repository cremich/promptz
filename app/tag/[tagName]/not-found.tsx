import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tag as TagIcon, ArrowLeft, Search } from "lucide-react";
import CreateButton from "@/components/common/create-button";

export default function TagNotFound() {
  return (
    <main className="py-8">
      <div className="flex flex-col space-y-6">
        {/* Not Found Content */}
        <div className="flex flex-col items-center justify-center py-16">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-6">
            <TagIcon className="h-8 w-8 text-muted-foreground" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Tag Not Found
          </h1>
          <p className="text-muted-foreground text-center max-w-md mb-8">
            The tag you're looking for doesn't exist or may have been removed.
            Try browsing our available prompts or search for something else.
          </p>

          <div className="flex gap-4">
            <Button asChild>
              <Link href="/prompts" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Browse All Prompts
              </Link>
            </Button>
            <CreateButton href="/prompts/create" name="Create Prompt" />
          </div>
        </div>

        {/* Suggestions */}
        <div className="max-w-2xl mx-auto w-full">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Popular Tags</CardTitle>
              <CardDescription>
                Explore these popular tags to find relevant prompts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {[
                  "IDE",
                  "CLI",
                  "Design",
                  "Implement",
                  "Test",
                  "CDK",
                  "TypeScript",
                ].map((tag) => (
                  <Button key={tag} variant="outline" size="sm" asChild>
                    <Link href={`/tag/${encodeURIComponent(tag)}`}>{tag}</Link>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
