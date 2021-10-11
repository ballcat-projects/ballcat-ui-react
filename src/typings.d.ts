import type { MenuDataItem } from '@ant-design/pro-layout';
import type { SysDictData, SysDictDataHash } from './services/ballcat/system';

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

export type R<T> = {
  code: number;
  message: string;
  data: T;
};

export type QueryParam<T> = {
  current: number;
  size: number;
  sortFields: string[];
  sortOrders: ('desc' | 'asc')[];
} & T;

export type PageResult<T> = {
  total: number;
  records: T[];
};

export type SelectData<T> = {
  // 显示的数据
  name: string;
  // 选中获取的属性
  value: any;
  // 是否被选中
  selected: boolean;
  // 是否禁用
  disabled: boolean;
  // 分组标识
  type: string;
  // 扩展对象
  extendObj: T;
};

export type TreeNode<T> = {
  title: string;
  key: any;
  disabled?: boolean;
  checkable?: boolean;
  selectable?: boolean;
  children?: TreeNode<T>[];
} & T;

declare namespace GLOBAL {
  type Is = {
    settings?: Partial<LayoutSettings>;
    menuArray?: MenuDataItem[];
    menuFirst: string;
    routerLoad?: boolean;
    user?: GLOBAL.UserInfo;
    dict?: {
      cache?: Record<string, SysDictData>;
      hashs?: SysDictDataHash;
    };
  };

  type Router = {
    hidden: boolean;
    icon: string;
    id: number;
    keepAlive: boolean;
    parentId: number;
    path: string;
    remarks: string;
    /**
     * 1 组件, 2 内链, 3 外链
     */
    targetType: 1 | 2 | 3;
    title: string;
    /**
     * 0: 目录 1: 菜单 2: 按钮
     */
    type: 0 | 1 | 2;
    uri: string;
    children?: Router[];
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
    attributes: {
      permissions: string[];
      roles: string[];
    };
  };
}
