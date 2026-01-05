import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function PromptNotFound() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="container mx-auto max-w-4xl px-6 py-16">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-black dark:text-zinc-50">
              Prompt Not Found
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              The prompt you&apos;re looking for doesn&apos;t exist or may have been moved.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/prompts"
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-black dark:bg-white dark:text-black rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
              >
                Browse All Prompts
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-black dark:text-white border border-zinc-300 dark:border-zinc-700 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
              >
                Go Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}