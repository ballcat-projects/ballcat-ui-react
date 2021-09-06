import React from 'react';
import { Button, Divider, Popconfirm } from 'antd';
import { useModel } from 'umi';
import type { AuthProps, AuthType } from '.';
import type { AuthItemProps, AuthListProps } from './typing';
import I18n from '@/utils/I18nUtils';

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

const defaultPrefixRender = (
  render: React.ReactNode | (() => React.ReactNode),
  key: string | number,
) => generateRender(render, <Divider key={`auth-divider-prefix-${key}`} type={'vertical'} />);

const defaultSuffixRender = (
  render: React.ReactNode | (() => React.ReactNode),
  key: string | number,
) => generateRender(render, <Divider key={`auth-divider-suffix-${key}`} type={'vertical'} />);

const getDom = (props: AuthProps & AuthType): React.ReactNode[] => {
  const {
    permission,
    type,
    text,
    localeKey,
    prefix,
    prefixRender,
    suffix,
    suffixRender,
    key: pk,
    onClick,
    configTitle,
    config,
  } = props;

  const domArray: React.ReactNode[] = [];
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

  // 展示前缀 - 指定展示, 或者指定 render 都会展示内容
  if (prefix || prefixRender) {
    domArray.push(defaultPrefixRender(prefixRender, key));
  }

  // 按钮
  switch (type) {
    case 'a':
      if (config || configTitle) {
        domArray.push(
          <Popconfirm
            key={`auth-a-popconfirm-${key}`}
            title={configTitle}
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
            <a style={props.style} key={`auth-a-${key}`}>
              {content}
            </a>
          </Popconfirm>,
        );
      } else {
        domArray.push(
          <a style={props.style} key={`auth-a-${key}`} onClick={onClick}>
            {content}
          </a>,
        );
      }
      break;
    case 'button':
      if (config || configTitle) {
        domArray.push(
          <Popconfirm
            key={`auth-button-popconfirm-${key}`}
            title={configTitle}
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
            <Button style={props.style} key={`auth-button-${key}`} type={'primary'}>
              {content}
            </Button>
          </Popconfirm>,
        );
      } else {
        domArray.push(
          <Button style={props.style} key={`auth-button-${key}`} onClick={onClick} type={'primary'}>
            {content}
          </Button>,
        );
      }
      break;
    default:
      if (typeof type === 'function') {
        domArray.push(type(content, permission));
      } else {
        domArray.push(type);
      }
      break;
  }

  // 展示后缀
  if (suffix || suffixRender) {
    domArray.push(defaultSuffixRender(suffixRender, key));
  }

  return domArray;
};

const Auth = (props: AuthProps & AuthType) => {
  const { permission } = props;
  const { initialState } = useModel('@@initialState');

  let domArray: React.ReactNode[] = [];

  // 有权限
  if (initialState?.user?.permissions?.indexOf(permission) !== -1) {
    domArray = domArray.concat(getDom(props));
  }

  return <>{domArray}</>;
};

Auth.A = (props: AuthProps) => <Auth {...props} type={'a'} />;

Auth.Button = (props: AuthProps) => <Auth {...props} type={'button'} />;

const AuthList = (props: AuthListProps) => {
  const domArray: React.ReactNode[] = [];

  props.auths.forEach((prop, i) => {
    domArray.push(
      getDom({
        ...prop,
        key: `list-child-${prop.permission}-${i.toString()}`,
        suffix: i !== props.auths.length - 1,
      }),
    );
  });

  return <div style={{ display: 'inline-block' }}>{domArray}</div>;
};

Auth.List = AuthList;

Auth.AL = (props: { auths: AuthItemProps[] }) => {
  const listProps: (AuthItemProps & AuthType)[] = [];

  props.auths.forEach((item) => {
    listProps.push({ ...item, type: 'a' });
  });

  return <Auth.List auths={listProps} />;
};

Auth.BL = (props: { auths: AuthItemProps[] }) => {
  const listProps: (AuthItemProps & AuthType)[] = [];

  props.auths.forEach((item) => {
    listProps.push({ ...item, type: 'button' });
  });

  return <Auth.List auths={listProps} />;
};

export default Auth;
