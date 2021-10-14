import type {
  BasicLayoutProps as ProLayoutProps,
  MenuDataItem,
  Settings,
} from '@ant-design/pro-layout';
import ProLayout, { WaterMark } from '@ant-design/pro-layout';
import React, { useEffect, useState, useRef } from 'react';
import RightContent from '@/components/RightContent';
import { history, Link, useIntl, useModel } from 'umi';
import LoadingComponent from '@ant-design/pro-layout/es/PageLoading';
import HeaderContent from '@/components/HeaderContent';
import { settings } from '@/utils/ConfigUtils';
import { Breadcrumb } from 'antd';
import Footer from '@/components/Footer';
import { redirect, goto } from '@/utils/RouteUtils';
import { User, Token } from '@/utils/Ballcat';
import I18n from '@/utils/I18nUtils';
import Icon from '@/components/Icon';
import type { MultiTabRef } from '@/components/MultiTab';
import MultiTab from '@/components/MultiTab';

export type BasicLayoutProps = {
  breadcrumbNameMap: Record<string, MenuDataItem>;
  route: ProLayoutProps['route'] & {
    authority: string[];
  };
  settings: Settings;
} & ProLayoutProps;

// @ts-ignore
const breadcrumbRender = (
  path: string,
  routes: { locale: boolean | undefined; path: string; name: string; routes: any[] }[],
) => {
  const list: any[] = [];
  if (!routes) {
    return list;
  }
  for (let i = 0; i < routes.length; i += 1) {
    const route = routes[i];
    const { path: rp, name: rn, locale } = route;
    if (rp && rp !== '/') {
      if (path.startsWith(rp)) {
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
      }
    }
  }
  return list;
};

const getFirstUrl = (menuArray: MenuDataItem[]): string => {
  const menu = menuArray[0];
  if (menu.children && menu.children.length > 0) {
    return getFirstUrl(menu.children);
  }

  return `${menu.path}`;
};

const renderMenuItem = (collapsed: boolean, title: string, hasSub: boolean, icon?: string) => {
  return (
    <span className="ant-pro-menu-item" title={title}>
      {!icon ? undefined : (
        <Icon
          type={icon}
          style={{
            marginRight: collapsed && hasSub ? '20px' : '10px',
            fontSize: collapsed ? '18px' : '16px',
          }}
        />
      )}
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
    route = {
      children: [],
      routes: [],
      unaccessible: true,
    },
  } = props;

  const multiTabRef = useRef<MultiTabRef>();

  const [collapsed, setCollapsed] = useState(false);
  const [reload, setReload] = useState(false);
  I18n.setIntl(useIntl());
  const { initialState, setInitialState } = useModel('@@initialState');

  let renderDom = children;

  if (reload) {
    renderDom = <LoadingComponent />;
  }

  useEffect(() => {
    if (!route.children) {
      route.children = [];
    }
    if (!route.routes) {
      route.routes = [];
    }

    if (
      !initialState?.routerLoad &&
      initialState?.menuArray &&
      initialState?.menuArray.length > 0
    ) {
      for (let i = 0; i < initialState.menuArray.length; i += 1) {
        const menu = initialState.menuArray[i];
        // @ts-ignore
        route.children.push(menu);
        // @ts-ignore
        route.routes.push(menu);
      }

      // 旧路由长度
      const ol = route.routes.length - initialState.menuArray.length;
      // 允许多少个旧路由
      const allowMax = 0;
      if (ol > allowMax) {
        // 移出旧路由
        route.children.splice(allowMax, ol);
        route.routes.splice(allowMax, ol);
      }

      setInitialState({
        ...initialState,
        settings: { ...settings, ...initialState.settings },
        routerLoad: true,
        menuFirst: getFirstUrl(initialState.menuArray),
      });
    }
  }, [initialState, initialState?.menuArray]);

  if (location.pathname === '/' && initialState?.menuFirst && initialState.menuFirst !== '/') {
    goto(initialState.menuFirst);
  }

  return (
    <ProLayout
      logo={'./logo.svg'}
      {...settings}
      {...initialState?.settings}
      formatMessage={I18n.getIntl().formatMessage}
      footerRender={() => <Footer />}
      {...props}
      route={route}
      collapsedButtonRender={false}
      collapsed={collapsed}
      onCollapse={setCollapsed}
      contentStyle={{ marginTop: settings.multiTab ? '56px' : undefined }}
      headerRender={(headerProps, defaultDom) => {
        if (settings.multiTab) {
          return (
            <>
              {defaultDom}
              <MultiTab multiTabRef={multiTabRef} />
            </>
          );
        }
        return defaultDom;
      }}
      headerContentRender={() => {
        return (
          <HeaderContent
            // @ts-ignore
            breadcrumbData={breadcrumbRender(location.pathname, route.routes)}
            collapsed={collapsed}
            onCollapse={setCollapsed}
            onReload={setReload}
          />
        );
      }}
      onPageChange={async () => {
        // 如果没有登录，重定向到 login
        if (!initialState?.user?.info && location.pathname !== '/user/login') {
          User.clean();
          Token.clean();
          redirect('/user/login');
        }
      }}
      onMenuHeaderClick={() => history.push(initialState?.menuFirst || '/')}
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
              {menuItemProps.name}
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
      <WaterMark
        content={settings.waterMark && !reload ? initialState?.user?.info?.nickname : undefined}
        style={{ height: '100%' }}
      >
        {renderDom}
      </WaterMark>
    </ProLayout>
  );
};

export default BasicLayout;
