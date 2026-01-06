import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'

// Mock Next.js cache functions for testing
jest.mock('next/cache', () => ({
  cacheLife: jest.fn(),
  cacheTag: jest.fn(),
  revalidateTag: jest.fn(),
  updateTag: jest.fn(),
}))

// Mock Next.js navigation for testing
const mockPush = jest.fn()
const mockReplace = jest.fn()
const mockBack = jest.fn()
const mockForward = jest.fn()
const mockRefresh = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    back: mockBack,
    forward: mockForward,
    refresh: mockRefresh,
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Add TextEncoder/TextDecoder polyfills for Node.js environment
Object.assign(global, {
  TextDecoder,
  TextEncoder
});