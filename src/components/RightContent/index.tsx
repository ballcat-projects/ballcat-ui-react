import { Space } from 'antd';
import { MoreOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { SelectLang, useModel } from 'umi';
import Avatar from './AvatarDropdown';
// @ts-ignore
import styles from './index.less';
import SettingDrawer from '@/components/SettingDrawer';
import FullScreen from '../FullScreen';

const GlobalHeaderRight: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const [showSetting, setShowSetting] = useState(false);
  const [full, setFull] = useState(false);

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

      <span className={styles.action} onClick={() => setFull(!full)}>
        <FullScreen full={full} onFullChange={setFull} />
      </span>

      {/* 如果不需要退出确认. 移除 exitConfirm 即可 */}
      <Avatar exitConfirm />
      <SelectLang className={styles.action} />

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
