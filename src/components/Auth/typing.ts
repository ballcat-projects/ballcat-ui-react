import type { MouseEvent, CSSProperties } from 'react';
import type { PopconfirmProps } from 'antd';
import type { ButtonType } from 'antd/lib/button';

export type AuthProps = {
  // 权限key
  permission: string;
  // dom
  render: JSX.Element;
};

export type AuthDomProps = {
  onClick?: (e: MouseEvent<HTMLElement> | undefined) => void;
  // 文本
  text?: string;
  key?: string | number | null | undefined;
  // 自定义样式, type 如果自定义则无效
  style?: CSSProperties;
};

export type AuthNoneProps = {
  // 权限key
  permission: string;
  // 国际化key, 如果 text 值存在, 则以text为准
  localeKey?: string;
  // 确认框的标题, 如果此值不为空, 则单击事件会在点击确认后触发
  confirmTitle?: string;
  // config.title 会覆盖 confirmTitle
  confirm?: PopconfirmProps;
} & AuthDomProps;

export type AuthAProps = AuthNoneProps;

export type AutnButtonProps = {
  icon?: string;
  type?: ButtonType;
  danger?: boolean;
} & AuthNoneProps;

export type AuthType = {
  // 标签类型
  type:
    | 'a'
    | 'button'
    | React.ReactNode
    | ((text: string | undefined, permission: string) => React.ReactNode);
};

export type AuthGroupProps = {
  permission?: string;
  children?: React.ReactNode | React.ReactNode[];
};
