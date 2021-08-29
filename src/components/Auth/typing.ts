import type { MouseEvent, CSSProperties } from 'react';
import type { PopconfirmProps } from 'antd';

export interface AuthProps {
  onClick?: (e: MouseEvent<HTMLElement> | undefined) => void;
  // 文本
  text?: string;
  // 国际化key, 如果 text 值存在, 则以text为准
  localeKey?: string;
  // 权限key
  permission: string;
  // 如果有权限, 是否在按钮前加个东西
  prefix?: boolean;
  // 自定义按钮前展示的内容
  prefixRender?: React.ReactNode | (() => React.ReactNode);
  // 如果有权限, 是否在按钮后加个东西
  suffix?: boolean;
  // 自定义按钮后展示的内容
  suffixRender?: React.ReactNode | (() => React.ReactNode);
  key?: string | number | null | undefined;
  // 自定义样式, type 如果自定义则无效
  style?: CSSProperties;
  // 确认框的标题, 如果此值不为空, 则单击事件会在点击确认后触发
  configTitle?: string;
  // config.title 会覆盖 configTitle
  config?: PopconfirmProps;
}

export interface AuthType {
  // 标签类型
  type:
    | 'a'
    | 'button'
    | React.ReactNode
    | ((text: string | undefined, permission: string) => React.ReactNode);
}

export interface AuthItemProps {
  onClick?: (e: MouseEvent<HTMLElement> | undefined) => void;
  // 文本
  text?: string;
  // 国际化key, 如果 text 值存在, 则以text为准
  localeKey?: string;
  // 权限key
  permission: string;
}

export interface AuthListProps {
  auths: (AuthItemProps & AuthType)[];
}
