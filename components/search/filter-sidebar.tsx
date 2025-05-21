import { ProjectRuleTag } from "@/lib/models/tags-model";
import { FilterSection } from "@/components/search/filter-section";

export default function FilterSidebar() {
  return (
    <div className="space-y-6">
      <FilterSection
        title="Tags"
        filterKey="tags"
        options={Object.values(ProjectRuleTag)}
      />
    </div>
  );
}
