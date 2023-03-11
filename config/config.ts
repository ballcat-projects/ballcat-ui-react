// https://umijs.org/config/
import { defineConfig } from 'umi';
import proxy from './proxy';
import routes from './routes';

import settings from './settings';

const isStart = process.env.REACT_APP_ENV === 'start';

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
  proxy: proxy.dev,
  manifest: {
    basePath: '/',
  },
  // Fast Refresh 热更新
  fastRefresh: {},
  extraBabelPlugins: ['react-activation/babel'],
  ignoreMomentLocale: true,
  // 不建议开启mfsu
  // mfsu: {},
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  chainWebpack: isStart
    ? undefined
    : function (config, { webpack }) {
        config.merge({
          optimization: {
            splitChunks: {
              chunks: 'all',
              minSize: 30000,
              // 共享该module的最小 chunk数量
              minChunks: 2,
              // 最多异步加载该模块
              maxAsyncRequests: 10,
              automaticNameDelimiter: '.',
              // 根据被提取的 chunk 自动生成
              name: true,
              cacheGroups: {
                antd: {
                  name: 'antd',
                  test({ resource }: any): boolean {
                    return (
                      /[\\/]node_modules[\\/]@ant-design[\\/]/.test(resource) ||
                      /[\\/]node_modules[\\/]antd.*[\\/]/.test(resource)
                    );
                  },
                  minChunks: 2,
                  reuseExistingChunk: true,
                  priority: 30,
                },
                antv: {
                  name: 'antv',
                  test({ resource }: any): boolean {
                    return /[\\/]node_modules[\\/]@antv[\\/]/.test(resource);
                  },
                  minChunks: 2,
                  reuseExistingChunk: true,
                  priority: 20,
                },
                vendor: {
                  name: 'vendors',
                  test({ resource }: any): boolean {
                    return /[\\/]node_modules[\\/]/.test(resource);
                  },
                  minChunks: 2,
                  reuseExistingChunk: true,
                  priority: 10,
                },
              },
            },
          },
        });
      },
});
