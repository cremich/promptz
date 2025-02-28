import { jest } from "@jest/globals";
export const generateServerClientUsingCookies = jest.fn().mockReturnValue({
  models: {
    prompt: {
      list: jest.fn(),
      get: jest.fn(),
    },
  },
});
