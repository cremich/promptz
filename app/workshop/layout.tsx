export default function WorkshopLayout({
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
        {children}
      </div>
    </section>
  )
}
