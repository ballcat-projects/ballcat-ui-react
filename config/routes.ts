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
      //   path: '/',
      //   redirect: '/welcome',
      // },
      // {
      //   path: '/welcome',
      //   name: 'welcome',
      //   icon: 'smile',
      //   component: './welcome',
      // },
    ],
  },
];
