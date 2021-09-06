import React, { useCallback } from 'react';
import { LogoutOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import { history, useModel } from 'umi';
import { stringify } from 'querystring';
import HeaderDropdown from '../HeaderDropdown';
// @ts-ignore
import styles from './index.less';
import { outLogin } from '@/services/ant-design-pro/api';
import { User, Token } from '@/utils/Ballcat';
import I18n from '@/utils/I18nUtils';

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = () => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const onMenuClick = useCallback(
    (event: {
      key: React.Key;
      keyPath: React.Key[];
      item: React.ReactInstance;
      domEvent: React.MouseEvent<HTMLElement>;
    }) => {
      const { key } = event;
      if (key === 'logout' && initialState) {
        outLogin().then(() => {
          setInitialState({ ...initialState, user: undefined });
          User.clean();
          Token.clean();
          //  退出登录，并且将当前的 url 保存
          const { query = {}, pathname } = history.location;
          const { redirect } = query;
          // Note: There may be security issues, please note
          if (window.location.pathname !== '/user/login' && !redirect) {
            history.replace({
              pathname: '/user/login',
              search: stringify({
                redirect: pathname,
              }),
            });
          }
        });
        return;
      }
      history.push(`/user/${key}`);
    },
    [initialState, setInitialState],
  );

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { user } = initialState;

  if (!user?.info?.nickname) {
    return loading;
  }

  const menuHeaderDropdown = (
    // @ts-ignore
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      <Menu.Item key="logout">
        <LogoutOutlined />
        {I18n.text('pages.login.out')}
      </Menu.Item>
    </Menu>
  );
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar size="small" className={styles.avatar} src={user?.info?.avatar} alt="avatar" />
        <span className={`${styles.name} anticon`}>{user?.info?.nickname}</span>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
