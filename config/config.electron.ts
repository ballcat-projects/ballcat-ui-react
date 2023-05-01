import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    'process.env': {
      msg: '现在是 electron 环境!',
      electron: 'electron',
      request: {
        prefix: 'http://admin.ballcat.cn/api',
      },
    },
  },
});
