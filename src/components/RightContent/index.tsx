import { Space } from 'antd';
import {
  FullscreenExitOutlined,
  FullscreenOutlined,
  MoreOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import React, { useState } from 'react';
import { SelectLang, useModel } from 'umi';
import Avatar from './AvatarDropdown';
// @ts-ignore
import styles from './index.less';
import SettingDrawer from '@/components/SettingDrawer';
import { settings } from '@/utils/ConfigUtils';

const GlobalHeaderRight: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { isFull, switchFull } = useModel('full-screen');
  const [showSetting, setShowSetting] = useState(false);

  if (!initialState || !initialState.settings) {
    return null;
  }

  const { navTheme, layout } = initialState.settings;
  let className = styles.right;

  if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
    className = `${styles.right}  ${styles.dark}`;
  }
  return (
    <Space className={className}>
      <span
        className={styles.action}
        onClick={() => {
          window.open('http://www.ballcat.cn/');
        }}
      >
        <QuestionCircleOutlined />
      </span>

      <span className={styles.action} onClick={() => switchFull()}>
        {isFull ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
      </span>

      {/* 如果不需要退出确认. 移除 exitConfirm 即可 */}
      <Avatar exitConfirm />
      {settings.i18n && <SelectLang className={styles.action} />}

      <span
        className={styles.action}
        style={{ cursor: 'pointer' }}
        onClick={() => {
          setShowSetting(true);
        }}
      >
        <MoreOutlined style={{ fontSize: '16px', fontWeight: 'bolder' }} />
      </span>

      <SettingDrawer hideHintAlert collapse={showSetting} onCollapseChange={setShowSetting} />
    </Space>
  );
};
export default GlobalHeaderRight;
