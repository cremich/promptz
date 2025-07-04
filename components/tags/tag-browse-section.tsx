import TagSection from "@/components/tags/tag-section";

export default function TagBrowseSection() {
  return (
    <div className="space-y-16 py-16">
      <TagSection
        title="Browse by Interface"
        description="Discover prompts and project rules tailored for your preferred Amazon Q Developer interface"
        tagNames={["IDE", "CLI", "Management Console"]}
      />

      <TagSection
        title="Browse by Development Activity"
        description="Find the perfect prompts for every stage of your software development lifecycle"
        tagNames={["Design", "Implement", "Test"]}
      />
    </div>
  );
}
