import { defineConfig } from 'tsup'

export default defineConfig((options) => ({
  clean: !options.watch,
  outDir: 'dist',
  treeshake: true,
  splitting: true,
  entryPoints: ['src/index.ts'],
  format: ['esm'],
  sourcemap: true,
}))
