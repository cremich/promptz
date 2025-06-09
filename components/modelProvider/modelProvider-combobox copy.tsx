import { searchModelProviders } from "@/lib/actions/search-modelProviders-action";
import { cn } from "@/lib/utils";
import * as Ariakit from "@ariakit/react";
import { startTransition, useEffect, useState } from "react";

export default function ModelProviderCombobox(
  { className, type, ...props },
  ref,
) {
  const [searchValue, setSearchValue] = useState("");
  const [matches, setMatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch model providers when search value changes
  useEffect(() => {
    // // Don't search if the input is empty
    // if (!searchValue) {
    //   setMatches([]);
    //   return;
    // }

    // Set loading state
    setIsLoading(true);

    // Fetch model providers based on search value
    const fetchModelProviders = async () => {
      try {
        const result = await searchModelProviders({ query: searchValue });
        setMatches(result.modelProviders || []);
      } catch (error) {
        console.error("Error searching model providers:", error);
        setMatches([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce the search to avoid too many requests
    const debounceTimer = setTimeout(() => {
      fetchModelProviders();
    }, 300);

    // Clean up the timer on component unmount or when searchValue changes
    return () => clearTimeout(debounceTimer);
  }, [searchValue]);

  return (
    <Ariakit.ComboboxProvider
      setValue={(value) => {
        startTransition(() => setSearchValue(value));
      }}
    >
      {/* <Ariakit.ComboboxLabel className="label">
        Model Provider
      </Ariakit.ComboboxLabel> */}
      <Ariakit.Combobox
        placeholder="Search model providers..."
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        value={searchValue}
      />
      <Ariakit.ComboboxPopover
        gutter={8}
        sameWidth
        className={cn(
          "popover flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
      >
        {isLoading ? (
          <div className="loading">Loading...</div>
        ) : matches.length > 0 ? (
          matches.map((value) => (
            <Ariakit.ComboboxItem
              key={value.id || value.name || value}
              value={value.name || value}
              className="combobox-item"
            />
          ))
        ) : (
          <div className="no-results">No results found</div>
        )}
      </Ariakit.ComboboxPopover>
    </Ariakit.ComboboxProvider>
  );
}
