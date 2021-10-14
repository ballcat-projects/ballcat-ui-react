import { Settings as LayoutSettings } from '@ant-design/pro-layout';

export type ProjectSetting = LayoutSettings & {
  pwa?: boolean;
  logo?: string;
  iconfontUrl: string;
  iconPrefix: string;
  historyType: 'browser' | 'hash' | 'memory';
  // 默认语言
  defaultLocal: 'zh-CN' | 'en-US';
  // 是否展示水印
  waterMark: boolean;
  // 是否展示顶部多页签
  multiTab: boolean;
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
  logo: './logo.svg',
  iconfontUrl: '//at.alicdn.com/t/font_2663734_eaxh2bnhyuo.js',
  iconPrefix: 'ballcat-icon-',
  historyType: 'hash',
  defaultLocal: 'zh-CN',
  waterMark: true,
  multiTab: true,
  storageOptions: {
    namespace: 'ballcat/',
    storage: 'local',
  },
};

export default Settings;
