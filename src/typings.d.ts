declare module 'slash2';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';
declare module 'omit.js';
declare module 'numeral';
declare module '@antv/data-set';
declare module 'mockjs';
declare module 'react-fittext';
declare module 'bizcharts-plugin-slider';

// preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
declare let ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: 'site' | undefined;

declare const REACT_APP_ENV: 'test' | 'dev' | 'pre' | false;

declare namespace GLOBAL {
  type Router = {
    hidden: boolean;
    icon: string;
    id: number;
    keepAlive: boolean;
    parentId: number;
    path: string;
    remarks: string;
    targetType: number;
    title: string;
    type: number;
    uri: string;
  };

  type UserInfo = {
    info: {
      avatar?: string;
      nickname?: string;
      type: number;
      userId: number;
      username: string;
    };
    permissions: string[];
    access_token: string;
    refresh_token: string;
    roles: string[];
    scope: 'server';
    token_type: 'bearer';
  };
}
