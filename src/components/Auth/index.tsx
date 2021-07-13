import type { MouseEvent } from 'react';
import React from 'react';
import { Button, Divider } from 'antd';
import { useIntl, useModel } from 'umi';

export interface AuthProps {
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
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
}

export interface AuthType {
  // 标签类型
  type:
    | 'a'
    | 'button'
    | React.ReactNode
    | ((text: string | undefined, permission: string) => React.ReactNode);
}

const generateRender = (
  render: React.ReactNode | (() => React.ReactNode),
  defaultNode: React.ReactNode,
) => {
  if (render) {
    if (typeof render === 'function') {
      return render();
    }
    return render;
  }

  return defaultNode;
};

const defaultPrefixRender = (render: React.ReactNode | (() => React.ReactNode)) =>
  generateRender(render, <Divider type={'vertical'} />);

const defaultSuffixRender = (render: React.ReactNode | (() => React.ReactNode)) =>
  generateRender(render, <Divider type={'vertical'} />);

const Auth = (props: AuthProps & AuthType) => {
  const {
    permission,
    type,
    text,
    localeKey,
    prefix,
    prefixRender,
    suffix,
    suffixRender,
    onClick,
  } = props;
  const { initialState } = useModel('@@initialState');

  const { formatMessage } = useIntl();

  const domArray: React.ReactNode[] = [];

  // 有权限
  if (initialState?.user?.permissions.indexOf(permission) !== -1) {
    // 展示前缀 - 指定展示, 或者指定 render 都会展示内容
    if (prefix || prefixRender) {
      domArray.push(defaultPrefixRender(prefixRender));
    }
    // 生成文本
    let content = text;
    // 文本不存在, 国际化key存在
    if (!content && localeKey) {
      content = formatMessage({ id: localeKey, defaultMessage: localeKey });
    }

    // 展示文本
    if (type === 'a') {
      domArray.push(<a>{content}</a>);
    } else if (type === 'button') {
      domArray.push(<Button type={'primary'}>{content}</Button>);
    } else if (typeof type === 'function') {
      domArray.push(type(content, permission));
    } else {
      domArray.push(type);
    }

    // 展示后缀
    if (suffix || suffixRender) {
      domArray.push(defaultSuffixRender(suffixRender));
    }
  }

  return (
    <div style={{ display: 'inline-block' }} onClick={onClick}>
      {domArray}
    </div>
  );
};

Auth.A = (props: AuthProps) => <Auth {...props} type={'a'} />;

Auth.Button = (props: AuthProps) => <Auth {...props} type={'button'} />;

export default Auth;
