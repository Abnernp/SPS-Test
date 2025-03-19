import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true, // Força a detecção de alterações
    },
    headers: {
      'Cache-Control': 'no-store', // Desativa o cache de arquivos estáticos
    },
  },
});
