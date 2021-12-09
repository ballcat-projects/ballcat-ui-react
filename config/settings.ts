import { Settings as LayoutSettings } from '@ant-design/pro-layout';

export type ProjectSetting = LayoutSettings & {
  pwa?: boolean;
  logo?: string;
  historyType: 'browser' | 'hash' | 'memory';
  // 是否开启国际化
  i18n: boolean;
  // 是否开始websocket连接
  websocket: boolean;
  // 默认语言
  defaultLocal: 'zh-CN' | 'en-US';
  // 是否展示水印
  waterMark: boolean;
  // 是否展示顶部多页签
  multiTab: boolean;
  // 顶部多页签风格
  multiTabStyle?: 'default' | 'card';
  storageOptions: {
    // 缓存key 前缀
    namespace: string;
    // 缓存类型, 目前仅支持 localStorage
    storage: 'local';
  };
};

const Settings: ProjectSetting = {
  navTheme: 'dark',
  primaryColor: '#1890ff',
  layout: 'side',
  contentWidth: 'Fluid',
  fixedHeader: true,
  fixSiderbar: true,
  title: 'Ball Cat',
  pwa: false,
  logo: '/logo.svg',
  historyType: 'browser',
  i18n: true,
  websocket: true,
  defaultLocal: 'zh-CN',
  waterMark: true,
  multiTab: true,
  storageOptions: {
    namespace: 'ballcat/',
    storage: 'local',
  },
};

export default Settings;
