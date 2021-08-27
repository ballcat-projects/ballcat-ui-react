import React from 'react';
import { Button, Divider } from 'antd';
import { useIntl, useModel } from 'umi';
import type { AuthProps, AuthType } from '.';
import type { AuthItemProps, AuthListProps } from './typing';

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

const getDom = (props: AuthProps & AuthType, formatMessage: any): React.ReactNode[] => {
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
  } = props;

  const domArray: React.ReactNode[] = [];
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

  let key = pk;
  // 如果未设置key, 则主动设置
  if (key === undefined || key === null) {
    key = `${permission}-${content}-${new Date().getTime()}`;
  }

  // 展示文本
  if (type === 'a') {
    domArray.push(
      <a key={`auth-a-${key}`} onClick={onClick}>
        {content}
      </a>,
    );
  } else if (type === 'button') {
    domArray.push(
      <Button onClick={onClick} key={`auth-button-${key}`} type={'primary'}>
        {content}
      </Button>,
    );
  } else if (typeof type === 'function') {
    domArray.push(type(content, permission));
  } else {
    domArray.push(type);
  }

  // 展示后缀
  if (suffix || suffixRender) {
    domArray.push(defaultSuffixRender(suffixRender));
  }

  return domArray;
};

const Auth = (props: AuthProps & AuthType) => {
  const { permission, key } = props;
  const { initialState } = useModel('@@initialState');

  const { formatMessage } = useIntl();

  let domArray: React.ReactNode[] = [];

  // 有权限
  if (initialState?.user?.permissions?.indexOf(permission) !== -1) {
    domArray = domArray.concat(getDom(props, formatMessage));
  }

  return (
    <div key={`auth-div-${key}`} style={{ display: 'inline-block' }}>
      {domArray}
    </div>
  );
};

Auth.A = (props: AuthProps) => <Auth {...props} type={'a'} />;

Auth.Button = (props: AuthProps) => <Auth {...props} type={'button'} />;

const AuthList = (props: AuthListProps) => {
  const domArray: React.ReactNode[] = [];

  const { formatMessage } = useIntl();

  props.auths.forEach((prop, i) => {
    domArray.push(
      getDom(
        {
          ...prop,
          key: `list-child-${prop.permission}-${i.toString()}`,
          suffix: i !== props.auths.length - 1,
        },
        formatMessage,
      ),
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
