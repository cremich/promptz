"use client";
import { Separator } from "@/components/ui/separator";
import {
  PromptCategory,
  QInterface,
  SdlcActivity,
} from "@/app/lib/definitions";
import { FilterSection } from "@/app/ui/browse/filter-section";

interface FilterSidebarProps {
  selectedInterface?: string[];
}

export function FilterSidebar({ selectedInterface }: FilterSidebarProps) {
  // const searchParams = useSearchParams();
  // const pathname = usePathname();
  // const { replace } = useRouter();

  // const interfaceOptions = Object.values(QInterface);
  // const categoryOptions = Object.values(PromptCategory);
  // const sdlcOptions = Object.values(SdlcActivity);

  return (
    <div className="space-y-6">
      <FilterSection
        title="Interface"
        filterKey="interface"
        options={Object.values(QInterface)}
      />

      <Separator />

      <FilterSection
        title="Categories"
        filterKey="category"
        options={Object.values(PromptCategory)}
        collapsible
      />

      <Separator />

      <FilterSection
        title="SDLC Activity"
        filterKey="sdlc"
        options={Object.values(SdlcActivity)}
        collapsible
      />

      {/* <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">Popularity</h3>
          <span className="text-xs text-muted-foreground">3+ stars</span>
        </div>
        <Slider defaultValue={[3]} max={5} step={1} />
      </div> */}
    </div>
  );
}
