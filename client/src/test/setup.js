import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Mock URL methods which are not supported in JSDOM by default
if (typeof window !== 'undefined') {
  window.URL.createObjectURL = vi.fn(() => 'blob:mock-object-url');
  window.URL.revokeObjectURL = vi.fn();
}

// Automatically clean up DOM containers after each test run
afterEach(() => {
  cleanup();
});
