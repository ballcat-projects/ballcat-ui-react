import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
  iconfontUrl: string;
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
  iconfontUrl: '//at.alicdn.com/t/font_2663734_w8cu7be1b9n.js',
  historyType: 'hash',
};

export default Settings;
