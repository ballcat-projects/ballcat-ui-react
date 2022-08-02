import React from 'react';
import { List, Select, Switch, Tooltip } from 'antd';
import { settings as defaultSettings } from '@/utils/ConfigUtils';
import type { SettingItemProps } from './typings';
import { getFormatMessage } from './index';
import type { ProjectSetting } from 'config/settings';

export const renderLayoutSettingItem = (item: SettingItemProps) => {
  const action = React.cloneElement(item.action, {
    disabled: item.disabled,
  });
  return (
    <Tooltip title={item.disabled ? item.disabledReason : ''} placement="left">
      <List.Item actions={[action]}>
        <span style={{ opacity: item.disabled ? 0.5 : 1 }}>{item.title}</span>
      </List.Item>
    </Tooltip>
  );
};
const LayoutSetting: React.FC<{
  settings: Partial<ProjectSetting>;
  changeSetting: (key: string, value: any, hideLoading?: boolean) => void;
}> = ({ settings = {}, changeSetting }) => {
  const formatMessage = getFormatMessage();
  const { contentWidth, splitMenus, fixedHeader, layout, fixSiderbar, multiTab, multiTabStyle } =
    settings || defaultSettings;

  return (
    <List
      split={false}
      dataSource={[
        {
          title: formatMessage({
            id: 'app.setting.content-width',
            defaultMessage: 'Content Width',
          }),
          action: (
            <Select<string>
              value={contentWidth || 'Fixed'}
              size="small"
              className="content-width"
              onSelect={(value: any) => {
                changeSetting('contentWidth', value);
              }}
              style={{ width: 80 }}
            >
              {layout === 'side' ? null : (
                <Select.Option value="Fixed">
                  {formatMessage({
                    id: 'app.setting.content-width.fixed',
                    defaultMessage: 'Fixed',
                  })}
                </Select.Option>
              )}
              <Select.Option value="Fluid">
                {formatMessage({
                  id: 'app.setting.content-width.fluid',
                  defaultMessage: 'Fluid',
                })}
              </Select.Option>
            </Select>
          ),
        },
        {
          title: formatMessage({
            id: 'app.setting.fixedheader',
            defaultMessage: 'Fixed Header',
          }),
          action: (
            <Switch
              size="small"
              className="fixed-header"
              checked={!!fixedHeader}
              onChange={(checked) => {
                changeSetting('fixedHeader', checked);
              }}
            />
          ),
        },
        {
          title: formatMessage({
            id: 'app.setting.fixedsidebar',
            defaultMessage: 'Fixed Sidebar',
          }),
          disabled: layout === 'top',
          disabledReason: formatMessage({
            id: 'app.setting.fixedsidebar.hint',
            defaultMessage: 'Works on Side Menu Layout',
          }),
          action: (
            <Switch
              size="small"
              className="fix-siderbar"
              checked={!!fixSiderbar}
              onChange={(checked) => changeSetting('fixSiderbar', checked)}
            />
          ),
        },
        {
          title: formatMessage({
            id: 'app.setting.showTabs',
            defaultMessage: 'Show top tab',
          }),
          action: (
            <Switch
              size="small"
              className="fix-siderbar"
              checked={!!multiTab}
              onChange={(checked) => changeSetting('multiTab', checked)}
            />
          ),
        },
        {
          title: formatMessage({ id: 'app.setting.splitMenus' }),
          disabled: layout !== 'mix',
          action: (
            <Switch
              size="small"
              checked={!!splitMenus}
              className="split-menus"
              onChange={(checked) => {
                changeSetting('splitMenus', checked);
              }}
            />
          ),
        },
        {
          title: formatMessage({ id: 'app.setting.multiTabStyle' }),
          action: (
            <Select
              value={multiTabStyle || 'default'}
              size="small"
              className="multi-tab-style"
              onSelect={(value: any) => {
                changeSetting('multiTabStyle', value);
              }}
              style={{ width: 80 }}
            >
              <Select.Option value="default">
                {formatMessage({ id: 'app.setting.multiTabStyle.default' })}
              </Select.Option>
              <Select.Option value="card">
                {formatMessage({ id: 'app.setting.multiTabStyle.card' })}
              </Select.Option>
            </Select>
          ),
        },
      ]}
      renderItem={renderLayoutSettingItem}
    />
  );
};

export default LayoutSetting;
