import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    'process.env': {
      msg: '现在是 web 环境!',
      request: {
        prefix: '/api',
      },
    },
  },
});
