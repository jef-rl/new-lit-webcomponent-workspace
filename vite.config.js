import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    // 1. Configure the library build
    lib: {
      entry: 'src/my-element.ts',
      name: 'MyElement',
      // 2. Restrict output to a single UMD file
      fileName: () => `my-element.umd.js`,
      formats: ['umd']
    },
    // 3. Explicitly set 'terser' as the minifier
    minify: 'terser',
    // 4. Configure Terser to remove all comments from the output
    terserOptions: {
      format: {
        comments: false
      }
    }
  }
});