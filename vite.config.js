import { defineConfig } from 'vite';
import * as path from 'path';
import envCompatible from 'vite-plugin-env-compatible';
import { createHtmlPlugin } from 'vite-plugin-html';
import { viteCommonjs } from '@originjs/vite-plugin-commonjs';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    build: {
      lib: {
        entry: path.resolve(__dirname, 'src/octuple.ts'),
        filename: '[name].js',
        libraryTarget: 'umd',
        name: 'Octuple',
        output: path.join(__dirname, 'lib'),
      },
      rollupOptions: {
        external: ['react'],
        output: {
          globals: {
            react: 'React',
          },
        },
      },
    },
    commonjsOptions: {
      exclude: ['node_modules'],
      include: [],
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import '@/styles/main.scss';`,
        },
      },
    },
    envPrefix: 'REACT_APP_',
    esbuild: {
      define: {
        this: 'window',
      },
    },
    publicDir: path.resolve(__dirname, './public'),
    plugins: [
      viteCommonjs(),
      envCompatible,
      createHtmlPlugin({}),
      svgr(),
      react(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
      extensions: ['.ts', '.tsx', '.js', '.json', '.css', '.scss'],
    },
  };
});
