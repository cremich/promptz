"use client";

import {
  SpaceBetween,
  Button,
  Container,
  Box,
  Link,
  Cards,
  CardsProps,
  Badge,
  Icon,
  Alert,
  SelectProps,
  Select,
  Grid,
  TextFilter,
} from "@cloudscape-design/components";
import { useRouter, useSearchParams } from "next/navigation";
import { usePromptCollection } from "../hooks/usePromptCollection";
import { Facets } from "@/repositories/PromptRepository";
import { useState } from "react";
import { PromptCategory, SdlcActivity } from "@/models/PromptViewModel";
import { createSelectOptions } from "@/utils/formatters";

interface PromptCollectionProps {
  limit?: number;
  promptsPerRow?: CardsProps.CardsLayout[];
  showLoadMore: boolean;
  showFilters: boolean;
  facets?: Array<Facets>;
}

export default function PromptCollection(props: PromptCollectionProps) {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const initFacets = props.facets || [];
  if (query) {
    initFacets.push({ facet: "SEARCH", value: query });
  }

  const router = useRouter();
  const {
    prompts,
    error,
    loading,
    hasMore,
    handleLoadMore,
    addFilter,
    resetFilter,
  } = usePromptCollection(props.limit, initFacets);
  const [categoryFilter, setCategoryFilter] = useState<SelectProps.Option>({});
  const [sdlcFilter, setSDLCFilter] = useState<SelectProps.Option>({});
  const [searchQuery, setSearchQuery] = useState<string>(query || "");

  const getCategoryFilter = () => {
    return createSelectOptions(PromptCategory, [PromptCategory.UNKNOWN]);
  };

  const getSDLCFilter = () => {
    return createSelectOptions(SdlcActivity, [SdlcActivity.UNKNOWN]);
  };

  const handleCategoryFilterChange = (option: SelectProps.Option) => {
    setCategoryFilter(option);
    addFilter({ facet: "CATEGORY", value: option.value! });
  };

  const handleSDLCFilterChange = (option: SelectProps.Option) => {
    setSDLCFilter(option);
    addFilter({ facet: "SDLC_PHASE", value: option.value! });
  };

  const handleDelayedSearch = (query: string) => {
    setSearchQuery(query);
    addFilter({ facet: "SEARCH", value: query });
  };

  const showClearFilter = () => {
    return categoryFilter.value || sdlcFilter.value;
  };

  const clearFilter = () => {
    setCategoryFilter({});
    setSDLCFilter({});
    setSearchQuery("");
    resetFilter();
  };

  if (error)
    return (
      <Alert
        statusIconAriaLabel="Error"
        type="error"
        header={error.name}
        data-testid="alert-error"
      >
        {error.message}
      </Alert>
    );

  return (
    <SpaceBetween size="s">
      <Cards
        variant="full-page"
        cardDefinition={{
          header: (item) => (
            <SpaceBetween size="xs">
              <SpaceBetween size="xs" direction="horizontal">
                {item.hasSDLCPhaseAssigned() && (
                  <Badge color="blue">{item.sdlcPhase}</Badge>
                )}
                <Badge color="green">{item.interface}</Badge>
                <Badge color="grey">{item.category}</Badge>
              </SpaceBetween>
              <Link href={`/prompt/${item.id}`} fontSize="heading-s">
                {item.name}
              </Link>
            </SpaceBetween>
          ),
          sections: [
            {
              id: "owner_username",
              content: (item) => (
                <Box>
                  <Icon name="user-profile" /> {item.createdBy()}
                </Box>
              ),
            },
            {
              id: "description",
              content: (item) => item.description,
            },
          ],
        }}
        cardsPerRow={props.promptsPerRow ?? [{ cards: 1 }]}
        items={prompts}
        loading={loading}
        loadingText="Loading a world of prompts"
        empty={
          <Container>
            <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
              <SpaceBetween size="m">
                <b>No prompts created yet</b>
                <Button
                  data-testid="button-create"
                  onClick={() => router.push("/prompt/create")}
                >
                  Be the first. Create a prompt.
                </Button>
              </SpaceBetween>
            </Box>
          </Container>
        }
        filter={
          props.showFilters && (
            <Grid
              gridDefinition={[
                {
                  colspan: { xxs: 12, xs: 12, default: 6, s: 3, m: 3, xl: 3 },
                },
                { colspan: { xxs: 6, xs: 6, default: 6, s: 2, m: 2, xl: 1 } },
                { colspan: { xxs: 6, xs: 6, default: 6, s: 2, m: 2, xl: 1 } },
                { colspan: { xxs: 6, xs: 6, default: 6, s: 2, m: 2, xl: 1 } },
              ]}
            >
              <Box margin={{ top: "xs" }}>
                <TextFilter
                  data-testid="textfilter-search"
                  filteringText={searchQuery}
                  filteringPlaceholder="Find Prompts"
                  onChange={({ detail }) =>
                    setSearchQuery(detail.filteringText)
                  }
                  onDelayedChange={({ detail }) =>
                    handleDelayedSearch(detail.filteringText)
                  }
                />
              </Box>
              <div>
                <Select
                  data-testid="select-sdlc"
                  inlineLabelText="SDLC Phase"
                  data-testing="sdlc-filter"
                  selectedOption={sdlcFilter}
                  onChange={({ detail }) =>
                    handleSDLCFilterChange(detail.selectedOption)
                  }
                  options={getSDLCFilter()}
                />
              </div>
              <div>
                <Select
                  data-testid="select-category"
                  inlineLabelText="Category"
                  data-testing="category-filter"
                  selectedOption={categoryFilter}
                  onChange={({ detail }) =>
                    handleCategoryFilterChange(detail.selectedOption)
                  }
                  options={getCategoryFilter()}
                />
              </div>
              <Box margin={{ top: "xs" }}>
                {showClearFilter() && (
                  <Button
                    data-testid="button-clear-filter"
                    iconAlign="right"
                    iconName="close"
                    onClick={clearFilter}
                  >
                    Clear Filter
                  </Button>
                )}
              </Box>
            </Grid>
          )
        }
      />

      {prompts.length > 0 && props.showLoadMore && (
        <Box textAlign="center">
          <Button
            data-testid="button-load-more"
            disabled={!hasMore}
            disabledReason="Congrats. You reached the end of Promptz."
            loading={loading}
            onClick={() => handleLoadMore()}
          >
            Load more
          </Button>
        </Box>
      )}
    </SpaceBetween>
  );
}
