import { defineConfig } from 'vite';
import * as path from 'path';
import { createHtmlPlugin } from 'vite-plugin-html';
import { viteCommonjs } from '@originjs/vite-plugin-commonjs';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import dts from 'vite-plugin-dts';
import envCompatible from 'vite-plugin-env-compatible';
import pkg from './package.json';
import react from '@vitejs/plugin-react';
import resolve from '@rollup/plugin-node-resolve';
import svgr from 'vite-plugin-svgr';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    build: {
      cssMinify: true,
      cssCodeSplit: false,
      lib: {
        entry: path.resolve(__dirname, 'src/octuple.ts'),
        fileName: '[name]',
        libraryTarget: 'umd',
        name: 'octuple',
        output: path.join(__dirname, 'lib'),
      },
      outDir: path.join(__dirname, 'lib'),
      rollupOptions: {
        output: {
          assetFileNames: (assetInfo) => {
            if (assetInfo.name === 'style.css') return 'octuple.css';
            return assetInfo.name;
          },
        },
      },
      sourcemap: false,
    },
    commonjsOptions: {
      include: [],
    },
    css: {
      devSourceMap: true,
      preprocessorOptions: {
        scss: {
          additionalData: `@import "${path.resolve(
            __dirname,
            'src/styles/main.scss'
          )}";`,
        },
      },
    },
    envPrefix: 'REACT_APP_',
    esbuild: {
      define: {
        this: 'window',
      },
    },
    publicDir: path.resolve(__dirname, 'public'),
    plugins: [
      createHtmlPlugin({}),
      dts({
        insertTypesEntry: true,
      }),
      envCompatible,
      svgr(),
      react(),
      viteCommonjs(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
      extensions: ['.mjs', '.ts', '.tsx', '.js', '.json', '.css', '.scss'],
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      input: [
        path.resolve(__dirname, 'src/octuple.ts'),
        path.resolve(__dirname, 'src/styles/main.scss'),
      ],
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'octuple.css';
          return assetInfo.name;
        },
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
      plugins: [
        babel,
        commonjs(),
        dts({
          insertTypesEntry: true,
        }),
        pkg,
        resolve(),
        terser,
        typescript(),
      ],
    },
    sourcemap: true,
  };
});
