import type {
  BasicLayoutProps as ProLayoutProps,
  MenuDataItem,
  Settings,
} from '@ant-design/pro-layout';
import type { Route } from '@ant-design/pro-layout/lib/typings';
import ProLayout, { WaterMark } from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import RightContent from '@/components/RightContent';
import { history, Link, useIntl, useModel } from 'umi';
import HeaderContent from '@/components/HeaderContent';
import { settings } from '@/utils/ConfigUtils';
import { Breadcrumb } from 'antd';
import Footer from '@/components/Footer';
import type { ExpandRoute } from '@/utils/RouteUtils';
import RouteUtils, { goto } from '@/utils/RouteUtils';
import { User, Token } from '@/utils/Ballcat';
import I18n from '@/utils/I18nUtils';
import Icon from '@/components/Icon';
import { AliveScope } from 'react-activation';
import MultiTab from '@/components/MultiTab';
import { KeepAlive as ReactKeepAlive } from 'react-activation';
import Notify from '@/utils/NotifyUtils';

export type BasicLayoutProps = {
  breadcrumbNameMap: Record<string, MenuDataItem>;
  route: ProLayoutProps['route'] & {
    authority: string[];
    routes: any[];
  };
  settings: Settings;
} & ProLayoutProps;

// @ts-ignore
const breadcrumbRender = (path: string, routes: Route[]) => {
  const list: any[] = [];
  if (!routes) {
    return list;
  }
  for (let i = 0; i < routes.length; i += 1) {
    const route = routes[i];
    const { path: rp, name: rn, locale, exact } = route;

    if (rp && rp !== '/') {
      if (
        // 全匹配
        (exact && path === rp) ||
        // 模糊匹配
        (!exact && path.startsWith(rp))
      ) {
        let name = rn;
        if (locale === undefined || locale === null || locale) {
          // 国际化失败, 则用key展示
          name = I18n.text(`menu.${rn}`);
        }

        list.push(<Breadcrumb.Item key={rp}>{name}</Breadcrumb.Item>);
        if (rp !== path && route?.routes) {
          // @ts-ignore
          list.push(...breadcrumbRender(path, route.routes));
        }

        // 找到匹配的就结束
        break;
      }
    }
  }
  return list;
};

const renderMenuItem = (collapsed: boolean, title: string, hasSub: boolean, icon?: string) => {
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

  I18n.setIntl(useIntl());
  // 国际化关闭, 当前语言与默认语言不符
  if (!settings.i18n && I18n.getLocal() !== settings.defaultLocal) {
    // 切换语言
    I18n.setLocal(settings.defaultLocal);
  }

  const [breadcrumbList, setBreadcrumbList] = useState<any[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const [reload, setReload] = useState(false);
  const [keepAliveProps, setKeepAliveProps] = useState<{ id?: string; name?: string }>({});

  useEffect(() => {
    if (location.pathname && location.pathname !== '/') {
      const list = breadcrumbRender(location.pathname, route.routes || []);
      setBreadcrumbList(list);

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

      // 旧路由长度
      const ol = newRoute.routes.length - routeArray.length;
      // 允许多少个旧路由
      const allowMax = 0;
      if (ol > allowMax) {
        // 移出旧路由
        newRoute.children.splice(allowMax, ol);
        newRoute.routes.splice(allowMax, ol);
      }
      route.routes = newRoute.routes;
      route.children = newRoute.routes;
      setLoad(true);

      if (location.pathname !== '/') {
        goto(location.pathname as string);
      }
    }
  }, [routeArray, load]);

  if (location.pathname === '/' && firstPath && firstPath !== '/') {
    goto(firstPath);
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
      contentStyle={{ marginTop: initialState?.settings?.multiTab ? '56px' : undefined }}
      headerRender={(headerProps, defaultDom) => {
        if (initialState?.settings?.multiTab) {
          return (
            <>
              {defaultDom}
              <MultiTab />
            </>
          );
        }
        return defaultDom;
      }}
      headerContentRender={() => {
        return (
          <HeaderContent
            // @ts-ignore
            breadcrumbData={breadcrumbList}
            collapsed={collapsed}
            onCollapse={setCollapsed}
            onReload={setReload}
          />
        );
      }}
      onPageChange={async () => {
        // 如果没有登录，重定向到 login
        if (!initialState?.user?.info) {
          User.clean();
          Token.clean();
          Notify.logout();
        }
      }}
      onMenuHeaderClick={() => history.push(firstPath || '/')}
      subMenuItemRender={(item) => {
        const { title, icon } = item.meta;
        return renderMenuItem(collapsed, title, true, icon);
      }}
      menuItemRender={(menuItemProps) => {
        const { redirectPath, title, icon } = menuItemProps.meta;
        if (!menuItemProps.path || location.pathname === menuItemProps.path) {
          return renderMenuItem(collapsed, title, false, icon);
        }

        if (menuItemProps.isUrl) {
          return (
            <a target={menuItemProps.target} href={menuItemProps.path}>
              {renderMenuItem(collapsed, title, false, icon)}
            </a>
          );
        }

        return (
          <Link to={redirectPath || menuItemProps.path}>
            {renderMenuItem(collapsed, title, false, icon)}
          </Link>
        );
      }}
      rightContentRender={() => <RightContent />}
    >
      <AliveScope>
        <WaterMark
          content={settings.waterMark && !reload ? initialState?.user?.info?.nickname : undefined}
          style={{ height: '100%' }}
        >
          <ReactKeepAlive id={keepAliveProps.id} name={keepAliveProps.name}>
            {children}
          </ReactKeepAlive>
        </WaterMark>
      </AliveScope>
    </ProLayout>
  );
};

export default BasicLayout;
