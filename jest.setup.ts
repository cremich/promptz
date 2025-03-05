import "@testing-library/jest-dom/jest-globals";
import "@testing-library/jest-dom";
import "whatwg-fetch";
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
