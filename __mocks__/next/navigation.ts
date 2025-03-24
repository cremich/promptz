import { jest } from "@jest/globals";

export const redirect = jest.fn();
export const useRouter = jest.fn().mockReturnValue({
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
});
export const useSearchParams = jest.fn().mockReturnValue({
  get: jest.fn(),
  getAll: jest.fn().mockReturnValue([]),
  has: jest.fn(),
  forEach: jest.fn(),
  entries: jest.fn(),
  keys: jest.fn(),
  values: jest.fn(),
  toString: jest.fn(),
});
export const usePathname = jest.fn().mockReturnValue("/rules");
