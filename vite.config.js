import { defineConfig } from 'vite';
import { createVuePlugin } from 'vite-plugin-vue2';

export default defineConfig({
  plugins: [createVuePlugin()],
  build: {
    lib: {
      entry: './main.cdn.js',
      name: 'VueWindowModal',
      fileName: 'vue-window-modal',
      formats: ['umd'],
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  }
});