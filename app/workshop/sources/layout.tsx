export default function WorkshopSourcesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className="relative flex-1 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#4F46E5]/5 via-transparent to-[#7C3AED]/5" />

      {/* Content */}
      <div className="container relative mx-auto max-w-7xl px-6 py-8 md:py-12">
        <div className="prose prose-lg dark:prose-invert prose-headings:scroll-m-20 prose-headings:tracking-tight prose-h1:text-4xl prose-h1:font-extrabold prose-h1:lg:text-5xl prose-h2:text-3xl prose-h2:font-semibold prose-h2:border-b prose-h2:pb-2 prose-h3:text-2xl prose-h3:font-semibold prose-h4:text-xl prose-h4:font-semibold prose-p:leading-7 prose-blockquote:border-l-2 prose-blockquote:border-indigo-500 prose-blockquote:pl-6 prose-blockquote:italic prose-code:relative prose-code:rounded prose-code:bg-muted prose-code:px-[0.3rem] prose-code:py-[0.2rem] prose-code:font-mono prose-code:text-sm prose-code:font-semibold prose-pre:overflow-x-auto prose-pre:rounded-lg prose-pre:border prose-pre:bg-zinc-950 prose-pre:py-4 dark:prose-pre:bg-zinc-900 prose-a:font-medium prose-a:text-indigo-600 prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-indigo-500 dark:prose-a:text-indigo-400 dark:hover:prose-a:text-indigo-300 prose-table:w-full prose-table:border-collapse prose-table:border prose-table:border-border prose-th:border prose-th:border-border prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:font-bold prose-td:border prose-td:border-border prose-td:px-4 prose-td:py-2 prose-hr:border-border prose-ul:my-6 prose-ul:ml-6 prose-ul:list-disc prose-ol:my-6 prose-ol:ml-6 prose-ol:list-decimal prose-li:mt-2">
          {children}
        </div>
      </div>
    </section>
  )
}
