import type {
  BasicLayoutProps as ProLayoutProps,
  MenuDataItem,
  Settings,
} from '@ant-design/pro-layout';
import ProLayout, { WaterMark } from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import { history, Link, useIntl, useModel } from 'umi';
import { settings } from '@/utils/ConfigUtils';
import Footer from '@/components/Footer';
import type { ExpandRoute } from '@/utils/RouteUtils';
import RouteUtils from '@/utils/RouteUtils';
import I18n from '@/utils/I18nUtils';
import Icon from '@/components/Icon';
import MultiTab from '@/components/MultiTab';
import { KeepAlive as ReactKeepAlive } from 'react-activation';
import Notify from '@/utils/NotifyUtils';
import Header from '@/components/Header';

export type BasicLayoutProps = {
  breadcrumbNameMap: Record<string, MenuDataItem>;
  route: ProLayoutProps['route'] & {
    authority: string[];
    routes: any[];
  };
  settings: Settings;
} & ProLayoutProps;

const renderMenuItem = (title: string, hasSub: boolean, icon?: string) => {
  return (
    <span className="ant-pro-menu-item" title={title}>
      {!icon ? undefined : <Icon type={icon} />}
      <span className="ant-pro-menu-item-title">{title}</span>
    </span>
  );
};

const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
  const {
    children,
    location = {
      pathname: '/',
    },
    route,
  } = props;

  const { routeArray, firstPath, load, setLoad } = useModel('dynamic-route');
  const { initialState } = useModel('@@initialState');
  const { isContentFull } = useModel('full-screen');

  const { multiTab } = initialState?.settings || {};

  I18n.setIntl(useIntl());
  // 国际化关闭, 当前语言与默认语言不符
  if (!settings.i18n && I18n.getLocal() !== settings.defaultLocal) {
    // 切换语言
    I18n.setLocal(settings.defaultLocal);
  }

  const [collapsed, setCollapsed] = useState(false);
  const [keepAliveProps, setKeepAliveProps] = useState<{ id?: string; name?: string }>({});

  useEffect(() => {
    if (location.pathname && location.pathname !== '/') {
      const currenMenu = RouteUtils.getMenuDict()[location.pathname];
      const newKeepAliveProps = {
        id: `${currenMenu?.id}`,
        name: currenMenu?.path,
      };
      // 404页面处理
      if (!newKeepAliveProps.name) {
        newKeepAliveProps.id = location.pathname;
        newKeepAliveProps.name = location.pathname;
      }

      setKeepAliveProps(newKeepAliveProps);
    }
  }, [location.pathname, route.routes]);

  useEffect(() => {
    if (load) {
      return;
    }
    const newRoute: ExpandRoute = { ...route };
    newRoute.routes = [];
    newRoute.children = [];

    if (routeArray && routeArray.length > 0) {
      for (let i = 0; i < routeArray.length; i += 1) {
        const menu = routeArray[i];
        newRoute.children.push(menu);
        newRoute.routes.push(menu);
      }

      route.routes = newRoute.routes;
      route.children = newRoute.routes;
      setLoad(true);

      if (location.pathname && location.pathname !== '/') {
        history.replace(location.pathname);
      }
    }
  }, [routeArray, load]);

  if (location.pathname === '/' && firstPath && firstPath !== '/') {
    history.push(firstPath);
  }

  let contentMarginTop = 56;
  if (!initialState?.settings?.fixedHeader) {
    contentMarginTop = 24;
  }

  return (
    <ProLayout
      footerRender={() => <Footer />}
      {...initialState?.settings}
      logo={settings.logo}
      formatMessage={I18n.getIntl().formatMessage}
      {...props}
      loading={!load || keepAliveProps.id === undefined}
      route={route}
      collapsedButtonRender={false}
      collapsed={collapsed}
      onCollapse={setCollapsed}
      contentStyle={{
        marginTop: multiTab || isContentFull ? `${contentMarginTop}px` : undefined,
      }}
      siderWidth={isContentFull ? 0 : undefined}
      headerHeight={isContentFull ? 0 : undefined}
      headerRender={(headerProps, defaultDom) => (isContentFull ? undefined : defaultDom)}
      headerContentRender={() => (
        <Header.Left route={route} collapsed={collapsed} onCollapse={setCollapsed} />
      )}
      rightContentRender={() => <Header.Right />}
      onPageChange={async () => {
        // 如果没有登录，重定向到 login
        if (!initialState?.user?.info) {
          Notify.logout();
        }
      }}
      onMenuHeaderClick={() => history.push(firstPath || '/')}
      subMenuItemRender={(item) => {
        const { title, icon } = item.meta;
        return renderMenuItem(title, true, icon);
      }}
      menuItemRender={(menuItemProps) => {
        const { redirectPath, title, icon } = menuItemProps.meta;
        if (!menuItemProps.path || location.pathname === menuItemProps.path) {
          return renderMenuItem(title, false, icon);
        }

        if (menuItemProps.isUrl) {
          return (
            <a target={menuItemProps.target} href={menuItemProps.path}>
              {renderMenuItem(title, false, icon)}
            </a>
          );
        }

        return (
          <Link to={redirectPath || menuItemProps.path}>{renderMenuItem(title, false, icon)}</Link>
        );
      }}
    >
      {initialState?.settings?.multiTab && <MultiTab />}
      <WaterMark
        content={settings.waterMark ? initialState?.user?.info?.nickname : undefined}
        style={{ height: '100%' }}
      >
        <ReactKeepAlive id={keepAliveProps.id} name={keepAliveProps.name}>
          {children}
        </ReactKeepAlive>
      </WaterMark>
    </ProLayout>
  );
};

export default BasicLayout;
