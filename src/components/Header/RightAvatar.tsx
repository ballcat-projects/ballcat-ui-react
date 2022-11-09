import { logout } from '@/services/ballcat/login';
import { User, Token, login_uri } from '@/utils/Ballcat';
import I18n from '@/utils/I18nUtils';
import UrlUtils from '@/utils/UrlUtils';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Menu, Modal, Spin } from 'antd';
import { stringify } from 'querystring';
import React, { useCallback } from 'react';
import { history, useModel } from 'umi';
// @ts-ignore
import styles from './Right.less';

export type GlobalHeaderRightProps = {
  exitConfirm?: boolean;
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ exitConfirm }) => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const exitHandler = useCallback(() => {
    return logout().then(() => {
      // @ts-ignore
      setInitialState({ ...initialState, user: undefined });
      User.clean();
      Token.clean();
      //  退出登录，并且将当前的 url 保存
      const { pathname } = history.location;
      if (pathname !== login_uri) {
        history.replace({
          pathname: login_uri,
          search: stringify({
            redirect: pathname,
          }),
        });
      }
    });
  }, [initialState, setInitialState]);

  const onMenuClick = useCallback(
    (event: {
      key: React.Key;
      keyPath: React.Key[];
      item: React.ReactInstance;
      domEvent: React.MouseEvent<HTMLElement>;
    }) => {
      const { key } = event;
      if (key === 'logout' && initialState) {
        if (exitConfirm) {
          Modal.confirm({
            title: I18n.text('hint'),
            content: I18n.text('logout.confirm.content'),
            onOk: async () => exitHandler(),
          });
        } else {
          exitHandler();
        }

        return;
      }
      history.push(`/user/${key}`);
    },
    [initialState, setInitialState, exitConfirm],
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

  const { nickname, avatar } = initialState?.user?.info || {};

  if (!nickname) {
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
    <Dropdown overlay={menuHeaderDropdown} overlayClassName={styles.container}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar
          size="small"
          icon={<UserOutlined />}
          className={styles.avatar}
          src={avatar ? UrlUtils.resolveImage(avatar) : undefined}
          alt="avatar"
        />
        <span className={`${styles.name} anticon`}>{nickname}</span>
      </span>
    </Dropdown>
  );
};

export default AvatarDropdown;
