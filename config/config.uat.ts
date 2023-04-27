import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    'process.env': {
      msg: '现在是 uat 环境!',
      request: {
        prefix: 'api',
      },
    },
  },
});
