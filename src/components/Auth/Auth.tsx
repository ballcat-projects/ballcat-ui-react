import React from 'react';
import { Button, Divider, Popconfirm, Space } from 'antd';
import { useModel } from 'umi';
import type { AuthProps, AuthType, AuthGroupProps } from '.';
import I18n from '@/utils/I18nUtils';
import type { GLOBAL } from '@/typings';
import type { CSSProperties } from '@umijs/renderer-react/node_modules/@types/react';

const getDom = (props: AuthProps & AuthType): React.ReactNode => {
  const {
    permission,
    type,
    style: propStyle,
    text,
    key,
    onClick: clickHandler,
    config,
    configTitle,
  } = props;

  const onClick = (e: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => {
    if (!config && !configTitle && clickHandler) {
      clickHandler(e);
    }
  };

  const style: CSSProperties = {
    ...propStyle,
    userSelect: propStyle?.userSelect ? propStyle.userSelect : 'none',
  };

  // 按钮
  switch (type) {
    case 'a':
      return (
        <a style={style} key={`auth-a-${key}`} onClick={onClick}>
          {text}
        </a>
      );
    case 'button':
      return (
        <Button style={style} key={`auth-button-${key}`} onClick={onClick} type={'primary'}>
          {text}
        </Button>
      );
    default:
      if (typeof type === 'function') {
        return type(text, permission);
      }
      return type;
  }
};

const getAuthDom = (props: AuthProps & AuthType): JSX.Element => {
  const { permission, text, localeKey, key: pk, onClick, configTitle, config } = props;
  // 生成文本
  let content = text;
  // 文本不存在, 国际化key存在
  if (!content && localeKey) {
    content = I18n.text(localeKey);
  }

  let key = pk;
  // 如果未设置key, 则主动设置
  if (key === undefined || key === null) {
    key = `${permission}-${content}-${new Date().getTime()}`;
  }

  let dom = getDom({ ...props, text: content, key });

  // 确认框
  if (config || configTitle) {
    dom = (
      <Popconfirm
        key={`auth-a-popconfirm-${key}`}
        title={configTitle}
        // 给予默认宽度
        overlayStyle={{ width: '150px' }}
        {...config}
        onConfirm={(e) => {
          if (onClick) {
            onClick(e);
          }
          if (config?.onConfirm) {
            config?.onConfirm(e);
          }
        }}
      >
        {dom}
      </Popconfirm>
    );
  }

  return <>{dom}</>;
};

/**
 * 是否拥有权限
 * @return true 拥有
 */
const hasPermission = (initialState: GLOBAL.Is | undefined, permission: string) => {
  return initialState?.user?.permissions?.indexOf(permission) !== -1;
};

const Auth = (props: AuthProps & AuthType): JSX.Element => {
  const { permission } = props;
  const { initialState } = useModel('@@initialState');

  // 有权限
  if (hasPermission(initialState, permission)) {
    return getAuthDom(props);
  }

  return <></>;
};

Auth.A = (props: AuthProps) => <Auth {...props} type={'a'} />;

Auth.Button = (props: AuthProps) => <Auth {...props} type={'button'} />;

const AuthGroup = ({ permission, children }: AuthGroupProps): JSX.Element => {
  const { initialState } = useModel('@@initialState');
  if (permission && !hasPermission(initialState, permission)) {
    return <></>;
  }

  return (
    <Space size={0} wrap={true} split={<Divider type="vertical" />}>
      {children}
    </Space>
  );
};

Auth.Group = AuthGroup;

export default Auth;
