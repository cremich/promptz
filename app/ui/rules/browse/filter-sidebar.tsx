import { ProjectRuleTag } from "@/app/lib/definitions";
import { FilterSection } from "@/app/ui/common/filter-section";

export function FilterSidebar() {
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
