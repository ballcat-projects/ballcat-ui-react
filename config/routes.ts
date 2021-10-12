export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/Login',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts',
    routes: [
      // {
      //   path: '/welcome234',
      //   name: 'welcome',
      //   redirect: '/welcome',
      // },
      // {
      //   path: '/welcome',
      //   name: 'welcome',
      //   icon: 'smile',
      //   component: './exception/error',
      // },
    ],
  },
];
