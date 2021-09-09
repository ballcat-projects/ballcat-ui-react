import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
  iconfontUrl: string;
  iconPrefix: string;
  historyType: 'browser' | 'hash' | 'memory';
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
  iconfontUrl: '//at.alicdn.com/t/font_2663734_ac285tyx19.js',
  iconPrefix: 'ballcat-icon-',
  historyType: 'hash',
};

export default Settings;
