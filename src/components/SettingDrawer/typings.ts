import type { ProSettings } from '@ant-design/pro-layout';

export type BodyProps = {
  titleKey: string;
  prefixCls: string;
};

export type MergerSettingsType<T> = Partial<T> & {
  primaryColor?: string;
  colorWeak?: boolean;
};

export type SettingItemProps = {
  title: React.ReactNode;
  action: React.ReactElement;
  disabled?: boolean;
  disabledReason?: React.ReactNode;
};

export type SettingDrawerProps = {
  settings?: MergerSettingsType<ProSettings>;
  collapse?: boolean;
  getContainer?: any;
  publicPath?: string;
  hideLoading?: boolean;
  hideColors?: boolean;
  hideHintAlert?: boolean;
  prefixCls?: string;
  hideCopyButton?: boolean;
  onCollapseChange?: (collapse: boolean) => void;
  onSettingChange?: (settings: MergerSettingsType<ProSettings>) => void;
  pathname?: string;
  disableStorageParams?: boolean;
};

export type SettingDrawerState = {
  collapse?: boolean;
  language?: string;
} & MergerSettingsType<ProSettings>;
