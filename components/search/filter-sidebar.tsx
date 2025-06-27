import { FilterSection } from "@/components/search/filter-section";
import { Separator } from "@/components/ui/separator";
import { fetchTagsByCategory } from "@/lib/actions/fetch-tags-action";

export default async function FilterSidebar() {
  const qInterfaceTags = await fetchTagsByCategory("Interface");
  const qAgentTags = await fetchTagsByCategory("Agent");
  const sdlcTags = await fetchTagsByCategory("SDLC");

  return (
    <div className="space-y-6">
      <FilterSection
        title="Interface"
        filterKey="tags"
        options={qInterfaceTags.map((tag) => tag.name)}
      />

      <Separator />

      <FilterSection
        title="Agent"
        filterKey="tags"
        options={qAgentTags.map((tag) => tag.name)}
        collapsible
      />

      <Separator />

      <FilterSection
        title="SDLC"
        filterKey="tags"
        options={sdlcTags.map((tag) => tag.name)}
        collapsible
      />
    </div>
  );
}
