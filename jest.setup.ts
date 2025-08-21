import "@testing-library/jest-dom/jest-globals";
import "@testing-library/jest-dom";

// Mock scrollIntoView for tests
Object.defineProperty(window.Element.prototype, "scrollIntoView", {
  writable: true,
  value: jest.fn(),
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
import { TextEncoder, TextDecoder } from "util";

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.assign(global, {
  TextDecoder,
  TextEncoder,
  ResizeObserver,
  structuredClone: (obj: any) => JSON.parse(JSON.stringify(obj)),
});
