import type { StorybookConfig } from '@storybook/react-vite';
import { UserConfig, mergeConfig } from 'vite';
import * as viteConfig from '../vite.config';
import * as path from 'path';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    //'@storybook/addon-coverage',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-links',
    'storybook-css-modules',
    '@storybook/addon-a11y',
    'storybook-addon-rtl',
    '@storybook/preset-create-react-app',
    {
      name: '@storybook/preset-scss',
      options: {
        sassLoaderOptions: {
          modules: true,
        },
      },
    },
  ],
  staticDirs: ['../public/assets'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) =>
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
    },
  },
  async viteFinal(config: UserConfig) {
    // Merge custom configuration into the default config
    return mergeConfig(config, {
      ...viteConfig,
      css: {
        devSourceMap: true,
        preprocessorOptions: {
          scss: {
            additionalData: `@import "../src/styles/main";`,
          },
        },
      },
      define: { 'process.env': {} },
      // Add dependencies to pre-optimization
      optimizeDeps: {
        include: ['storybook-dark-mode'],
      },
      // plugins: [
      //   istanbul({
      //     include: 'src/*',
      //     exclude: ['node_modules', 'test/'],
      //     extension: ['.js', '.ts', '.tsx'],
      //   }),
      // ],
    });
  },
};

export default config;
