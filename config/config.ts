// https://umijs.org/config/
import { defineConfig } from 'umi';

import settings from './settings';
import proxy from './proxy';
import routes from './routes';

const { REACT_APP_ENV } = process.env;
const isDev = REACT_APP_ENV === 'dev';

export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  history: {
    type: settings.historyType,
  },
  layout: false,
  // https://umijs.org/zh-CN/plugins/plugin-locale
  locale: {
    default: settings.defaultLocal,
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': settings.primaryColor,
  },
  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  esbuild: {},
  title: false,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  // Fast Refresh 热更新
  fastRefresh: {},
  extraBabelPlugins: ['react-activation/babel'],
  ignoreMomentLocale: true,
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  chunks: isDev ? undefined : ['vendors', 'umi'],
  chainWebpack: isDev
    ? undefined
    : function (config, { webpack }) {
        if (REACT_APP_ENV !== 'dev') {
          config.merge({
            optimization: {
              splitChunks: {
                chunks: 'all',
                minSize: 30000,
                minChunks: 3,
                automaticNameDelimiter: '.',
                cacheGroups: {
                  vendor: {
                    name: 'vendors',
                    test({ resource }: any): boolean {
                      return /[\\/]node_modules[\\/]/.test(resource);
                    },
                    priority: 10,
                  },
                },
              },
            },
          });
        }
      },
});
