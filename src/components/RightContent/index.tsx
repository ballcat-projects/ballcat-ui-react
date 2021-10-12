import { Space } from 'antd';
import { MoreOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { SelectLang, useModel } from 'umi';
import Avatar from './AvatarDropdown';
import HeaderSearch from '../HeaderSearch';
// @ts-ignore
import styles from './index.less';
import SettingDrawer from '@/components/SettingDrawer';

const GlobalHeaderRight: React.FC = () => {
  const { initialState } = useModel('@@initialState');
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
      <HeaderSearch
        className={`${styles.action} ${styles.search}`}
        placeholder="站内搜索"
        defaultValue="umi ui"
        options={[
          { label: <a href="https://umijs.org/zh/guide/umi-ui.html">umi ui</a>, value: 'umi ui' },
          {
            label: <a href="next.ant.design">Ant Design</a>,
            value: 'Ant Design',
          },
          {
            label: <a href="https://protable.ant.design/">Pro Table</a>,
            value: 'Pro Table',
          },
          {
            label: <a href="https://prolayout.ant.design/">Pro Layout</a>,
            value: 'Pro Layout',
          },
        ]}
        // onSearch={value => {
        //
        // }}
      />
      <span
        className={styles.action}
        onClick={() => {
          window.open('https://pro.ant.design/docs/getting-started');
        }}
      >
        <QuestionCircleOutlined />
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
