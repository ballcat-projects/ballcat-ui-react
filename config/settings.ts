import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
  iconfontUrl: string;
  iconPrefix: string;
  historyType: 'browser' | 'hash' | 'memory';
  // 默认语言
  defaultLocal: 'zh-CN' | 'en-US';
  // 是否展示水印
  waterMark: boolean;
} = {
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
};

export default Settings;
