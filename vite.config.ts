import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/to-do-list.github.io',
  server: {
    watch: { usePolling: true },
  },
});
