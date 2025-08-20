import { FilterSection } from "@/components/search/filter-section";
import { Separator } from "@/components/ui/separator";
import { fetchTagsByCategory } from "@/lib/actions/fetch-tags-action";

interface FilterSidebarProps {
  type?: "prompts" | "rules" | "agents";
}

export default async function FilterSidebar({
  type = "prompts",
}: FilterSidebarProps) {
  if (type === "rules") {
    // Tag categories relevant for project rules
    const frameworkTags = await fetchTagsByCategory("Framework");
    const iacTags = await fetchTagsByCategory("IaC");
    const languageTags = await fetchTagsByCategory("Language");
    const sdlcTags = await fetchTagsByCategory("SDLC");

    return (
      <div className="space-y-6">
        <FilterSection
          title="Framework"
          filterKey="tags"
          options={frameworkTags.map((tag) => tag.name)}
        />

        <Separator />

        <FilterSection
          title="Infrastructure as Code"
          filterKey="tags"
          options={iacTags.map((tag) => tag.name)}
          collapsible
        />

        <Separator />

        <FilterSection
          title="Language"
          filterKey="tags"
          options={languageTags.map((tag) => tag.name)}
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

  if (type === "agents") {
    // Tag categories relevant for agents
    const toolTags = await fetchTagsByCategory("Tool");
    const qAgentTags = await fetchTagsByCategory("Agent");
    const sdlcTags = await fetchTagsByCategory("SDLC");
    const frameworkTags = await fetchTagsByCategory("Framework");

    return (
      <div className="space-y-6">
        <FilterSection
          title="Tools"
          filterKey="tags"
          options={toolTags.map((tag) => tag.name)}
        />

        <Separator />

        <FilterSection
          title="Agent Type"
          filterKey="tags"
          options={qAgentTags.map((tag) => tag.name)}
          collapsible
        />

        <Separator />

        <FilterSection
          title="Framework"
          filterKey="tags"
          options={frameworkTags.map((tag) => tag.name)}
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

  // Default prompts configuration
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
