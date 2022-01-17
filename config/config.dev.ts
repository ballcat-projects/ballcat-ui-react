import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    'process.env': {
      msg: '现在是 dev 环境!',
    },
  },
});
