import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/__tests__/**/*.ts'],
    coverage: {
      reporter: ['text', 'html'],
      exclude: [
        'src/config/**',
        'src/types/**',
        'src/**/*.d.ts'
      ]
    }
  }
});
