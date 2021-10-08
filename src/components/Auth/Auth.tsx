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
  renderDom: (props: AuthDomProps) => React.ReactNode,
): React.ReactNode => {
  const { permission, text, localeKey, onClick, confirmTitle, confirm, style, disabled } = props;
  let { domKey } = props;
  //  是否使用确认框
  const isConfirm = confirm || confirmTitle;
  // 生成文本
  let content = text;
  // 文本不存在, 国际化key存在
  if (!content && localeKey) {
    content = I18n.text(localeKey);
  }

  // 如果未设置key, 则主动设置
  if (domKey === undefined || domKey === null) {
    domKey = `${permission}-${content}-${new Date().getTime()}`;
  }

  let dom = renderDom({
    disabled,
    text: content,
    domKey: `auth-render-${domKey}`,
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
        key={`auth-a-popconfirm-${domKey}`}
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
  const permissions = initialState?.user?.permissions || [];
  return permissions.indexOf(permission) !== -1;
};

const Auth = (props: AuthProps): JSX.Element => {
  const { permission, render } = props;
  const { initialState } = useModel('@@initialState');

  // 有权限
  if (hasPermission(initialState, permission)) {
    return <>{render()}</>;
  }

  return <></>;
};

const aDisabledStyle: React.CSSProperties = {
  color: 'rgba(0,0,0,.25)',
  cursor: 'not-allowed',
  pointerEvents: 'none',
};

Auth.A = (props: AuthAProps) => {
  const { permission, domKey } = props;

  return (
    <Auth
      key={`auth-dom-a-${domKey}`}
      permission={permission}
      render={() =>
        getAuthDom(props, (dp) => {
          const style = { ...dp.style };

          if (dp.disabled) {
            style.color = aDisabledStyle.color;
            style.cursor = aDisabledStyle.cursor;
            style.pointerEvents = aDisabledStyle.pointerEvents;
          }

          return (
            <a key={dp.domKey} style={style} onClick={dp.onClick}>
              {dp.text}
            </a>
          );
        })
      }
    />
  );
};

Auth.Button = (props: AutnButtonProps) => {
  const { permission, domKey, type, icon, danger } = props;
  let iconDom: React.ReactNode;
  if (icon) {
    iconDom = <Icon type={icon} style={{ marginRight: '5px' }} />;
  }

  return (
    <Auth
      key={`auth-dom-button-${domKey}`}
      permission={permission}
      render={() =>
        getAuthDom(props, (dp) => {
          return (
            <Button
              type={type}
              key={dp.domKey}
              style={dp.style}
              onClick={dp.onClick}
              danger={danger}
              disabled={dp.disabled}
            >
              {iconDom}
              {dp.text}
            </Button>
          );
        })
      }
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
