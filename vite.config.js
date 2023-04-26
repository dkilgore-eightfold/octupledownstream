import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import { viteCommonjs } from '@originjs/vite-plugin-commonjs';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import dts from 'vite-plugin-dts';
import envCompatible from 'vite-plugin-env-compatible';
import * as packageJson from './package.json';
import react from '@vitejs/plugin-react';
import resolve from '@rollup/plugin-node-resolve';
import svgr from 'vite-plugin-svgr';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import * as path from 'path';

// Vite import statement transform workaround to vertx error in Vite's axe-core.js usage.
// https://github.com/vitejs/vite/issues/6393#issuecomment-1006819717
function viteIgnoreStaticImport(importKeys) {
  return {
    name: 'vite-plugin-ignore-static-import',
    enforce: 'pre',
    // 1. insert to optimizeDeps.exclude to prevent pre-transform
    config(config) {
      config.optimizeDeps = {
        ...(config.optimizeDeps ?? {}),
        exclude: [...(config.optimizeDeps?.exclude ?? []), ...importKeys],
      };
    },
    // 2. push a plugin to rewrite the 'vite:import-analysis' prefix
    configResolved(resolvedConfig) {
      const VALID_ID_PREFIX = `/@id/`;
      const reg = new RegExp(
        `${VALID_ID_PREFIX}(${importKeys.join('|')})`,
        'g'
      );
      resolvedConfig.plugins.push({
        name: 'vite-plugin-ignore-static-import-replace-idprefix',
        transform: (code) =>
          reg.test(code) ? code.replace(reg, (m, s1) => s1) : code,
      });
    },
    // 3. rewrite the id before 'vite:resolve' plugin transform to 'node_modules/...'
    resolveId: (id) => {
      if (importKeys.includes(id)) {
        return { id, external: true };
      }
    },
  };
}

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
        external: [...Object.keys(packageJson.peerDependencies)],
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
          modules: {
            generateScopedName: '[local]_[hash:base64:7]',
            localsConvention: 'camelCase',
          },
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
      viteIgnoreStaticImport(['vertx']),
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
        packageJson,
        resolve(),
        terser,
        typescript({ tsconfig: path.resolve(__dirname, 'tsconfig.json') }),
      ],
    },
    sourcemap: true,
  };
});
