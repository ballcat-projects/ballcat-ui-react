import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    'process.env': {
      msg: '现在是 prod 环境!',
      // 如果要使用. 需要自己申请 google cloud api
      // https://console.cloud.google.com/google/maps-apis/overview
      google_map_api: 'AIzaSyDpi5kQbJ19Pb3Y6u75ALDSTejWJEVgGVE',
    },
  },
});
