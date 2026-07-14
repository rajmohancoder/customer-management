import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const port = parseInt(env.VITE_REMOTE_PORT || '3001', 10);

  return {
    plugins: [
      react(),
      federation({
        name: 'customer',
        filename: 'remoteEntry.js',
        exposes: {
          './CustomerApp': './src/App.tsx',
          './Routes': './src/routes/index.tsx',
        },
        shared: {
          react: {
            singleton: true,
            requiredVersion: '^18.0.0',
          },
          'react-dom': {
            singleton: true,
            requiredVersion: '^18.0.0',
          },
          'react-router-dom': {
            singleton: true,
            requiredVersion: '^6.0.0',
          },
        } as any,
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    build: {
      target: 'esnext',
    },
    server: {
      port,
      strictPort: true,
    },
    preview: {
      port,
      strictPort: true,
    },
  };
});
