import { data } from "@/amplify/data/resource";
import { jest } from "@jest/globals";

export const mockPrompt = {
  id: "123",
  name: "Test Prompt",
  description: "Test Description",
  instruction: "Test Instruction",
  howto: "Test How To",
  tags: ["tag1", "tag2"],
  owner_username: "Test Author",
  owner: "author123",
  public: true,
  sourceURL: "https://example.com",
  createdAt: "2024-01-01",
  updatedAt: "2024-01-01",
};

export const mockProjectRules = [
  {
    id: "test-id-1",
    name: "Test Project Rule 1",
    slug: "test-project-rule-1",
    description: "Test description 1",
    content: "# Test Content 1\n\nThis is test rule 1.",
    tags: ["test", "rule"],
    public: true,
    sourceURL: "https://github.com/test/repo1",
    owner_username: "testuser",
    owner: "user-id::testuser",
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
  },
  {
    id: "test-id-2",
    name: "Test Project Rule 2",
    slug: "test-project-rule-2",
    description: "Test description 2",
    content: "# Test Content 2\n\nThis is test rule 2.",
    tags: ["test", "rule"],
    public: true,
    sourceURL: "https://github.com/test/repo2",
    owner_username: "testuser",
    owner: "user-id::testuser",
    createdAt: "2023-01-02T00:00:00.000Z",
    updatedAt: "2023-01-02T00:00:00.000Z",
  },
];

export const getPromptMock = jest
  .fn()
  .mockReturnValue(Promise.resolve({ data: mockPrompt }));

export const createPromptMock = jest.fn().mockReturnValue(Promise.resolve({}));
export const updatePromptMock = jest.fn().mockReturnValue(Promise.resolve({}));

export const getProjectRuleMock = jest
  .fn()
  .mockReturnValue(Promise.resolve({ data: mockProjectRules[0] }));

export const listProjectRuleMock = jest
  .fn()
  .mockReturnValue(Promise.resolve({ data: mockProjectRules }));

export const createProjectRuleMock = jest.fn().mockReturnValue(
  Promise.resolve({
    data: {
      id: "test-id",
      title: "Test Project Rule",
      slug: "test-project-rule-test-id",
      description: "Test description",
      content: "# Test Content\n\nThis is a test rule.",
      tags: ["test", "rule"],
      public: true,
      sourceURL: "https://github.com/test/repo",
      owner_username: "testuser",
    },
    errors: null,
  }),
);

export const updateProjectRuleMock = jest.fn().mockReturnValue(
  Promise.resolve({
    data: {
      id: "test-id",
      title: "Updated Project Rule",
      slug: "updated-project-rule-test-id",
      description: "Updated description",
      content: "# Updated Content\n\nThis is an updated rule.",
      tags: ["test", "updated"],
      public: true,
      sourceURL: "https://github.com/test/repo-updated",
      owner_username: "testuser",
    },
    errors: null,
  }),
);

export const deleteProjectRuleMock = jest.fn().mockReturnValue(
  Promise.resolve({
    data: { id: "test-id" },
    errors: null,
  }),
);

export const graphqlMock = jest.fn().mockReturnValue(
  Promise.resolve({
    data: {
      listRuleBySlug: {
        items: [
          {
            id: "test-id",
            name: "Test Project Rule",
            slug: "test-project-rule-123",
            description: "Test description",
            content: "# Test Content\n\nThis is a test rule.",
            tags: ["test", "rule"],
            public: true,
            sourceURL: "https://github.com/test/repo",
            owner_username: "testuser",
            owner: "user-id::testuser",
            createdAt: "2023-01-01T00:00:00.000Z",
            updatedAt: "2023-01-01T00:00:00.000Z",
          },
        ],
        nextToken: null,
      },
    },
    errors: null,
  }),
);

export const generateServerClientUsingCookies = jest.fn().mockReturnValue({
  models: {
    prompt: {
      list: jest.fn(),
      get: getPromptMock,
      create: createPromptMock,
      update: updatePromptMock,
      delete: jest.fn(),
    },
    projectRule: {
      list: listProjectRuleMock,
      get: getProjectRuleMock,
      create: createProjectRuleMock,
      update: updateProjectRuleMock,
      delete: deleteProjectRuleMock,
    },
  },
  graphql: graphqlMock,
});
