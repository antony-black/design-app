import react from '@vitejs/plugin-react';
import * as path from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import svgr from 'vite-plugin-svgr';
import packageJson from './package.json' with { type: 'json' };

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const publicEnv = Object.entries(env).reduce((acc, [key, value]) => {
    if (key.startsWith('VITE_')) {
      return {
        ...acc,
        [key]: value,
      };
    }
    return acc;
  }, {});

  return {
    plugins: [react(), svgr()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      port: +env.PORT,
    },
    preview: {
      port: +env.PORT,
    },
    define: {
      'process.env': publicEnv,
    },
    build: {
      outDir: 'build',
      sourcemap: true,
    },
    test: {
      root: import.meta.dirname,
      name: packageJson.name,
      environment: 'jsdom',

      typecheck: {
        enabled: true,
        tsconfig: path.join(import.meta.dirname, 'tsconfig.json'),
      },

      globals: true,
      watch: false,
      setupFiles: ['./src/setupTests.ts'],
    },
  };
});
