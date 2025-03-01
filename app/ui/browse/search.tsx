"use client";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";
import debounce from "lodash/debounce";

export default function SearchBox({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Create a debounced version of the search handler
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      const params = new URLSearchParams(searchParams);

      if (term) {
        params.set("query", term);
      } else {
        params.delete("query");
      }

      router.replace(`${pathname}?${params.toString()}`);
    }, 300),
    [pathname, searchParams],
  );

  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        className="pl-10 bg-background"
        placeholder={placeholder}
        defaultValue={searchParams.get("query")?.toString()}
        onChange={(e) => debouncedSearch(e.target.value)}
      />
    </div>
  );
}
