import type { StorybookConfig } from '@storybook/react-vite';
import { UserConfig, mergeConfig } from 'vite';
// import istanbul from 'vite-plugin-istanbul';
import * as viteConfig from '../vite.config';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    //'@storybook/addon-coverage',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-links',
    // '@storybook/addon-styling',
    '@storybook/addon-a11y',
    'storybook-addon-rtl',
    {
      name: '@storybook/addon-postcss',
      options: {
        styleLoaderOptions: {},
        cssLoaderOptions: {
          modules: true,
          sourceMap: true,
          importLoaders: 1,
        },
        postcssLoaderOptions: {
          implementation: require('postcss'),
        },
      },
    },
  ],
  staticDirs: ['../public/assets'],
  framework: '@storybook/react-vite',
  core: {
    builder: '@storybook/builder-vite',
  },
  features: {
    storyStoreV7: true,
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
  async viteFinal(
    config: UserConfig,
    { configType }
  ): Promise<Record<string, any>> {
    // Merge custom configuration into the default config
    return mergeConfig(config, {
      ...viteConfig,
      css: {
        devSourceMap: true,
        preprocessorOptions: {
          scss: {
            additionalData: `@import "${path.resolve(
              __dirname,
              '../src/styles/main.scss'
            )}";`,
            modules: {
              generateScopedName: '[local]_[hash:base64:7]',
              localsConvention: 'camelCase',
            },
          },
        },
      },
      define: configType === 'DEVELOPMENT' && {
        'process.env': {},
        global: {},
      },
      // plugins: [
      //   istanbul({
      //     include: ['src/*'],
      //     exclude: ['node_modules', 'test', 'stories'],
      //     extension: ['.ts', '.tsx'],
      //     forceBuildInstrument: process.env.COVERAGE === 'true',
      //   }),
      // ],
    });
  },
};

export default config;
