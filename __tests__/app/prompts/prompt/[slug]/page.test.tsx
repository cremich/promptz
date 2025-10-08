import { render, screen } from "@testing-library/react";
import { notFound } from "next/navigation";
import PromptDetailPage, {
  generateMetadata,
  generateStaticParams,
} from "@/app/prompts/prompt/[slug]/page";
import { fetchPromptBySlug } from "@/lib/actions/fetch-prompts-action";
import { describe } from "node:test";

// Mock dependencies
jest.mock("next/navigation", () => ({
  notFound: jest.fn(),
}));

jest.mock("@/lib/actions/fetch-prompts-action", () => ({
  fetchPromptBySlug: jest.fn(),
}));

jest.mock("@/components/prompt/prompt-detail", () => {
  return function MockPromptDetail({ prompt, isOwner }: any) {
    return (
      <div data-testid="prompt-detail">
        <h1>{prompt.name}</h1>
        <p>{prompt.description}</p>
        <span data-testid="is-owner">{isOwner ? "owner" : "not-owner"}</span>
      </div>
    );
  };
});

const mockFetchPromptBySlug = fetchPromptBySlug as jest.MockedFunction<
  typeof fetchPromptBySlug
>;

const mockNotFound = notFound as jest.MockedFunction<typeof notFound>;

describe("PromptDetailPage", () => {
  const mockPrompt = {
    id: "test-prompt-1",
    slug: "test-prompt",
    name: "Test Prompt",
    description: "A test prompt description",
    content: "Test content",
    author: "test-author",
    authorId: "user123::test",
    tags: ["testing"],
    scope: "PUBLIC",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should render prompt detail when prompt exists", async () => {
    mockFetchPromptBySlug.mockResolvedValue(mockPrompt);

    const params = Promise.resolve({ slug: "test-prompt" });
    const result = await PromptDetailPage({ params });

    render(result);

    expect(screen.getByTestId("prompt-detail")).toBeInTheDocument();
    expect(screen.getByText("Test Prompt")).toBeInTheDocument();
    expect(screen.getByText("A test prompt description")).toBeInTheDocument();
  });

  test("should call notFound when prompt does not exist", async () => {
    mockFetchPromptBySlug.mockResolvedValue(undefined);

    const params = Promise.resolve({ slug: "non-existent" });
    await PromptDetailPage({ params });

    expect(mockNotFound).toHaveBeenCalled();
  });
});

describe("generateMetadata", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should generate metadata for existing prompt", async () => {
    const mockPrompt = {
      name: "Test Prompt",
      description: "A test prompt description",
    };
    mockFetchPromptBySlug.mockResolvedValue(mockPrompt as any);

    const params = Promise.resolve({ slug: "test-prompt" });
    const metadata = await generateMetadata({ params });

    expect(metadata).toEqual({
      title: "Test Prompt prompt for Amazon Q Developer",
      description: "A test prompt description",
      openGraph: {
        title: "Test Prompt prompt for Amazon Q Developer",
        description: "A test prompt description",
      },
    });
  });

  test("should return not found metadata when prompt does not exist", async () => {
    mockFetchPromptBySlug.mockResolvedValue(undefined);

    const params = Promise.resolve({ slug: "non-existent" });
    const metadata = await generateMetadata({ params });

    expect(metadata).toEqual({
      title: "Prompt Not Found",
    });
  });
});

describe("generateStaticParams", () => {
  test("should generate static params from markdown index", async () => {
    const params = await generateStaticParams();

    expect(Array.isArray(params)).toBe(true);
    expect(params.length).toBeGreaterThan(0);
    expect(params[0]).toHaveProperty("slug");
    expect(typeof params[0].slug).toBe("string");
  });
});
