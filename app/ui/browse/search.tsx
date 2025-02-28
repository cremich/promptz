"use client";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function SearchBox({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);

    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        className="pl-10 bg-background"
        placeholder={placeholder}
        defaultValue={searchParams.get("query")?.toString()}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
      />
    </div>
  );
}
