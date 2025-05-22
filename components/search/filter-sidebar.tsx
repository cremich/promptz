import {
  PromptCategory,
  QInterface,
  SdlcActivity,
} from "@/lib/models/tags-model";
import { FilterSection } from "@/components/search/filter-section";
import { Separator } from "@/components/ui/separator";

export default function FilterSidebar() {
  return (
    <div className="space-y-6">
      <FilterSection
        title="Interface"
        filterKey="tags"
        options={Object.values(QInterface)}
      />

      <Separator />

      <FilterSection
        title="Categories"
        filterKey="tags"
        options={Object.values(PromptCategory)}
        collapsible
      />

      <Separator />

      <FilterSection
        title="SDLC Activity"
        filterKey="tags"
        options={Object.values(SdlcActivity)}
        collapsible
      />
    </div>
  );
}
