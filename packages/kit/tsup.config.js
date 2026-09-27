import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.js',
    Modal: 'src/Modal/Modal.jsx',
  },
  format: ['esm'],
  dts: false,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  loader: {
    '.css': 'copy',
  },
  onSuccess: 'node scripts/copy-css.js',
})
