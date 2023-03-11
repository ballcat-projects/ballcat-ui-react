import type { CSSProperties, MouseEvent } from 'react';
import type { PopconfirmProps } from 'antd';
import type { ButtonType } from 'antd/lib/button';

// 值为false表示不鉴权
type Permission = false | string;

export type AuthProps = {
  // 权限key
  permission: Permission;
  // dom
  render: () => React.ReactNode;
};

export type AuthDomProps = {
  onClick?: (e: MouseEvent<HTMLElement> | undefined) => void;
  // 文本
  text?: string;
  domKey?: string | number | null | undefined;
  // 自定义样式, type 如果自定义则无效
  style?: CSSProperties;
  disabled?: boolean;
  containerType?: 'menu-item';
};

export type AuthNoneProps = {
  // 权限key
  permission: Permission;
  // 国际化key, 如果 text 值存在, 则以text为准
  localeKey?: string;
  // 确认框的标题, 如果此值不为空, 则单击事件会在点击确认后触发
  confirmTitle?: string;
  // config.title 会覆盖 confirmTitle
  confirm?: PopconfirmProps;
} & AuthDomProps;

export type AuthNoneOptionalProps = { permission?: Permission } & Omit<AuthNoneProps, 'permission'>;

export type AuthAProps = AuthNoneProps;

export type AutnButtonProps = {
  icon?: React.ReactNode | string;
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
