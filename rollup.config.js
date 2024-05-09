import { defineConfig } from 'rollup';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import url from '@rollup/plugin-url';
import svgr from '@svgr/rollup';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import dts from 'rollup-plugin-dts';
// import typescriptEngine from 'typescript';

import pkg from './package.json' assert { type: 'json' };

export default defineConfig(
  {
    input: './src/octuple.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: false,
        exports: 'named',
        name: pkg.name,
      },
      {
        file: pkg.module,
        format: 'es',
        exports: 'named',
        sourcemap: false,
      },
    ],
    plugins: [
      postcss({
        plugins: [],
        minimize: true,
      }),
      external({ includeDependencies: true }),
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
      // typescript({
      //   tsconfig: './tsconfig.json',
      //   typescript: typescriptEngine,
      //   sourceMap: false,
      //   exclude: [
      //     'coverage',
      //     '.storybook',
      //     'storybook-static',
      //     'config',
      //     'dist',
      //     'node_modules/**',
      //     '*.cjs',
      //     '*.mjs',
      //     '**/__snapshots__/*',
      //     '**/__tests__',
      //     '**/*.test.js+(|x)',
      //     '**/*.test.ts+(|x)',
      //     '**/*.mdx',
      //     '**/*.story.ts+(|x)',
      //     '**/*.story.js+(|x)',
      //     '**/*.stories.ts+(|x)',
      //     '**/*.stories.js+(|x)',
      //     'setupTests.ts',
      //     'vitest.config.ts',
      //   ],
      // }),
      url(),
      svgr(),
      terser(),
    ],
  },
  {
    input: 'dist/esm/types/src/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    external: [/\.(css|less|scss)$/],
    plugins: [dts()],
  }
);
