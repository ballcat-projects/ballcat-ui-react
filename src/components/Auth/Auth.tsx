import React from 'react';
import { Button, Divider, Popconfirm, Space } from 'antd';
import { useModel } from 'umi';
import type {
  AuthProps,
  AuthGroupProps,
  AuthAProps,
  AuthNoneProps,
  AuthDomProps,
  AutnButtonProps,
} from '.';
import I18n from '@/utils/I18nUtils';
import type { GLOBAL } from '@/typings';
import Icon from '../Icon';

const getAuthDom = (
  props: AuthNoneProps,
  renderDom: (props: AuthDomProps) => JSX.Element,
): JSX.Element => {
  const { permission, text, localeKey, key: pk, onClick, confirmTitle, confirm, style } = props;
  //  是否使用确认框
  const isConfirm = confirm || confirmTitle;
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

  let dom = renderDom({
    text: content,
    key: `auth-render-${key}`,
    style: { ...style, userSelect: style?.userSelect ? style.userSelect : 'none' },
    onClick: (e) => {
      // 不使用确认框
      if (!isConfirm && onClick) {
        onClick(e);
      }
    },
  });

  // 确认框
  if (isConfirm) {
    dom = (
      <Popconfirm
        key={`auth-a-popconfirm-${key}`}
        title={confirmTitle}
        // 给予默认宽度
        overlayStyle={{ width: '150px' }}
        {...confirm}
        onConfirm={(e) => {
          if (onClick) {
            onClick(e);
          }
          if (confirm?.onConfirm) {
            confirm?.onConfirm(e);
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

const Auth = (props: AuthProps) => {
  const { permission, render } = props;
  const { initialState } = useModel('@@initialState');

  // 有权限
  if (hasPermission(initialState, permission)) {
    return render;
  }

  return <></>;
};

Auth.A = (props: AuthAProps) => {
  const { permission } = props;

  return (
    <Auth
      permission={permission}
      render={getAuthDom(props, (dp) => {
        return (
          <a key={dp.key} style={dp.style} onClick={dp.onClick}>
            {dp.text}
          </a>
        );
      })}
    />
  );
};

Auth.Button = (props: AutnButtonProps) => {
  const { permission, type, icon, danger } = props;
  let iconDom: React.ReactNode;
  if (icon) {
    iconDom = <Icon type={icon} />;
  }

  return (
    <Auth
      permission={permission}
      render={getAuthDom(props, (dp) => {
        return (
          <Button type={type} key={dp.key} style={dp.style} onClick={dp.onClick} danger={danger}>
            {iconDom}
            {dp.text}
          </Button>
        );
      })}
    />
  );
};

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
