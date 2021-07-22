import React from 'react';
import { Switch, List } from 'antd';
import type { ProSettings } from '@ant-design/pro-layout';
import { getFormatMessage } from './index';
import { renderLayoutSettingItem } from './LayoutChange';

const RegionalSetting: React.FC<{
  settings: Partial<ProSettings>;
  changeSetting: (key: string, value: any, hideLoading?: boolean) => void;
}> = ({ settings = {}, changeSetting }) => {
  const formatMessage = getFormatMessage();
  const regionalSetting = ['header', 'footer', 'menu', 'menuHeader'];

  // 目前版本 settingDrawer 脚本配置 footer 有问题. 关了无法展示. 移除
  regionalSetting.splice(regionalSetting.indexOf('footer'), 1);
  // 默认自己绑定在顶栏, 关闭了自己就没了
  regionalSetting.splice(regionalSetting.indexOf('header'), 1);

  return (
    <List
      split={false}
      renderItem={renderLayoutSettingItem}
      dataSource={regionalSetting.map((key) => {
        return {
          title: formatMessage({ id: `app.setting.regionalsettings.${key}` }),
          action: (
            <Switch
              size="small"
              className={`regional-${key}`}
              checked={settings[`${key}Render`] || settings[`${key}Render`] === undefined}
              onChange={(checked) =>
                changeSetting(`${key}Render`, checked === true ? undefined : false)
              }
            />
          ),
        };
      })}
    />
  );
};

export default RegionalSetting;
