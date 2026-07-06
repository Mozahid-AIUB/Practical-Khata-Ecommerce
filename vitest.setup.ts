import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// jsdom has no IntersectionObserver; framer-motion's whileInView needs it.
class IntersectionObserverStub {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
  root = null;
  rootMargin = "";
  thresholds = [];
}

vi.stubGlobal("IntersectionObserver", IntersectionObserverStub);
