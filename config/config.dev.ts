import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    // 示例: console.log(process.env.msg)
    'process.env.msg': '现在是 dev 环境!',
  },
});
