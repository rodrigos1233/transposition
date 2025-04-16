// This setup file adds custom matchers for asserting on DOM nodes
// which works with Vitest or Jest
import '@testing-library/jest-dom';

// Declare globals for Vitest testing environment
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import matchers from '@testing-library/jest-dom/matchers';

// Extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

// Runs cleanup after each test is complete to avoid memory leaks
afterEach(() => {
  cleanup();
});

// Set up global mocks here if needed
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
