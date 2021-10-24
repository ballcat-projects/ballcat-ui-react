import './index.less';
import { CopyOutlined, NotificationOutlined } from '@ant-design/icons';
import { isBrowser } from '@ant-design/pro-utils';
import { Alert, Button, Divider, Drawer, List, message, Switch } from 'antd';
import React, { useEffect, useState } from 'react';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import omit from 'omit.js';
import type { ProSettings } from '@ant-design/pro-layout';
import BlockCheckbox from './BlockCheckbox';
import ThemeColor from './ThemeColor';
import getLocales, { getLanguage } from './locales';
import { genStringToTheme } from './utils';
import LayoutSetting, { renderLayoutSettingItem } from './LayoutChange';
import RegionalSetting from './RegionalChange';
import { useModel } from 'umi';
import ConfigUtils from '@/utils/ConfigUtils';
import type { BodyProps, MergerSettingsType, SettingDrawerProps } from './typings';
import { LayoutSetting as LayoutSettingUtils } from '@/utils/Ballcat';
import type { Settings as LayoutSettings } from '@ant-design/pro-layout';

export const getFormatMessage = (): ((data: { id: string; defaultMessage?: string }) => string) => {
  const formatMessage = ({ id }: { id: string; defaultMessage?: string }): string => {
    const locales = getLocales();
    return locales[id];
  };
  return formatMessage;
};

const Body: React.FC<BodyProps> = ({ children, prefixCls, titleKey }) => (
  <div style={{ marginBottom: 24 }}>
    <h3 className={`${prefixCls}-drawer-title`}>
      {getFormatMessage()({ id: `app.setting.${titleKey}` })}
    </h3>
    {children}
  </div>
);

const genCopySettingJson = (settingState: MergerSettingsType<ProSettings>) =>
  JSON.stringify(
    omit(
      {
        ...settingState,
        primaryColor: genStringToTheme(settingState.primaryColor),
      },
      ['colorWeak'],
    ),
    null,
    2,
  );

const themeList: { key: string; titleKey: string }[] = [
  { key: 'light', titleKey: 'light' },
  { key: 'dark', titleKey: 'dark' },
  { key: 'realDark', titleKey: 'dark' },
];

const colorList: { key: string; color: string }[] = [
  {
    key: 'daybreak',
    color: '#1890FF',
  },
  {
    key: 'dust',
    color: '#F5222D',
  },
  {
    key: 'volcano',
    color: '#FA541C',
  },
  {
    key: 'sunset',
    color: '#FAAD14',
  },
  {
    key: 'cyan',
    color: '#13C2C2',
  },
  {
    key: 'green',
    color: '#52C41A',
  },
  {
    key: 'geekblue',
    color: '#2F54EB',
  },
  {
    key: 'purple',
    color: '#722ED1',
  },
];

/**
 * 可视化配置组件
 *
 * @param props
 */
const SettingDrawer: React.FC<SettingDrawerProps> = (props) => {
  const { hideColors, hideHintAlert, hideCopyButton, getContainer, prefixCls = 'ant-pro' } = props;

  const { initialState, setInitialState } = useModel('@@initialState');
  const layoutSetting: Partial<LayoutSettings> = initialState?.settings || ConfigUtils.settings;

  const [show, setShow] = useMergedState(false, {
    value: props.collapse,
    onChange: props.onCollapseChange,
  });
  const [language, setLanguage] = useState<string>(getLanguage());

  const { navTheme, primaryColor, layout, colorWeak } = layoutSetting || {};

  useEffect(() => {
    // 语言修改，这个是和 locale 是配置起来的
    const onLanguageChange = (): void => {
      if (language !== getLanguage()) {
        setLanguage(getLanguage());
      }
    };

    /** 如果不是浏览器 都没有必要做了 */
    if (!isBrowser()) return () => null;
    window.document.addEventListener('languagechange', onLanguageChange, {
      passive: true,
    });

    return () => window.document.removeEventListener('languagechange', onLanguageChange);
  }, []);
  /**
   * 修改设置
   *
   * @param key
   * @param value
   * @param hideMessageLoading
   */
  const changeSetting = (key: string, value: string | boolean) => {
    const nextState = { ...layoutSetting };
    nextState[key] = value;

    if (value === undefined) {
      delete nextState[key];
    } else {
      nextState[key] = value;
    }

    if (key === 'layout') {
      nextState.contentWidth = value === 'top' ? 'Fixed' : 'Fluid';
    }
    if (key === 'layout') {
      nextState.splitMenus = value === 'mix';
    }

    if (key === 'colorWeak' && value === true) {
      const dom = document.querySelector('body');
      if (dom) {
        dom.dataset.prosettingdrawer = dom.style.filter;
        dom.style.filter = 'invert(80%)';
      }
    }
    if (key === 'colorWeak' && value === false) {
      const dom = document.querySelector('body');
      if (dom) {
        dom.style.filter = dom.dataset.prosettingdrawer || 'none';
        delete dom.dataset.prosettingdrawer;
      }
    }

    // 缓存
    LayoutSettingUtils.set(nextState);
    // @ts-ignore
    setInitialState({ ...initialState, settings: nextState });
  };

  const formatMessage = getFormatMessage();

  const baseClassName = `${prefixCls}-setting`;
  return (
    <Drawer
      visible={show}
      width={300}
      onClose={() => setShow(false)}
      placement="right"
      getContainer={getContainer}
      style={{
        zIndex: 999,
      }}
    >
      <div className={`${baseClassName}-drawer-content`}>
        <Body titleKey="pagestyle" prefixCls={baseClassName}>
          <BlockCheckbox
            prefixCls={baseClassName}
            list={themeList}
            value={navTheme!}
            configType="theme"
            key="navTheme"
            onChange={(value) => changeSetting('navTheme', value)}
          />
        </Body>
        <Body titleKey="themecolor" prefixCls={baseClassName}>
          <ThemeColor
            value={primaryColor!}
            colors={hideColors ? [] : colorList}
            formatMessage={formatMessage}
            onChange={(color) => changeSetting('primaryColor', color)}
          />
        </Body>

        <Divider />

        <Body titleKey="navigationmode" prefixCls={baseClassName}>
          <BlockCheckbox
            prefixCls={baseClassName}
            value={layout!}
            key="layout"
            configType="layout"
            list={[
              {
                key: 'side',
                titleKey: 'sidemenu',
              },
              {
                key: 'top',
                titleKey: 'topmenu',
              },
              {
                key: 'mix',
                titleKey: 'mixmenu',
              },
            ]}
            onChange={(value) => changeSetting('layout', value)}
          />
        </Body>
        <LayoutSetting settings={layoutSetting} changeSetting={changeSetting} />
        <Divider />

        <Body titleKey="regionalsettings" prefixCls={baseClassName}>
          <RegionalSetting settings={layoutSetting} changeSetting={changeSetting} />
        </Body>

        <Divider />

        <Body titleKey="othersettings" prefixCls={baseClassName}>
          <List
            split={false}
            renderItem={renderLayoutSettingItem}
            dataSource={[
              {
                title: formatMessage({ id: 'app.setting.weakmode' }),
                action: (
                  <Switch
                    size="small"
                    className="color-weak"
                    checked={!!colorWeak}
                    onChange={(checked) => {
                      changeSetting('colorWeak', checked);
                    }}
                  />
                ),
              },
            ]}
          />
        </Body>
        {hideHintAlert && hideCopyButton ? null : <Divider />}

        {hideHintAlert ? null : (
          <Alert
            type="warning"
            message={formatMessage({
              id: 'app.setting.production.hint',
            })}
            icon={<NotificationOutlined />}
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        {hideCopyButton ? null : (
          <Button
            block
            icon={<CopyOutlined />}
            style={{ marginBottom: 24 }}
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(genCopySettingJson(layoutSetting));
                message.success(formatMessage({ id: 'app.setting.copyinfo' }));
                // eslint-disable-next-line no-empty
              } catch (error) {}
            }}
          >
            {formatMessage({ id: 'app.setting.copy' })}
          </Button>
        )}
      </div>
    </Drawer>
  );
};

export default SettingDrawer;
