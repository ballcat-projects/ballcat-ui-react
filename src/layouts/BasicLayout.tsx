import type {
  BasicLayoutProps as ProLayoutProps,
  MenuDataItem,
  Settings,
} from '@ant-design/pro-layout';
import ProLayout, { WaterMark } from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import RightContent from '@/components/RightContent';
import { history, Link, useIntl, useModel } from 'umi';
import LoadingComponent from '@ant-design/pro-layout/es/PageLoading';
import HeaderContent from '@/components/HeaderContent';
import { settings } from '@/utils/ConfigUtils';
import { Breadcrumb } from 'antd';
import Footer from '@/components/Footer';
import { redirect } from '@/utils/RouteUtils';
import { User, Token } from '@/utils/Ballcat';
import I18n from '@/utils/I18nUtils';

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

  const [collapsed, setCollapsed] = useState(false);
  const [reload, setReload] = useState(false);
  I18n.setIntl(useIntl());
  const { initialState, setInitialState } = useModel('@@initialState');

  useEffect(() => {
    if (!route.children) {
      route.children = [];
    }
    if (!route.routes) {
      route.routes = [];
    }

    if (!initialState?.routerLoad && initialState?.menuArray) {
      const first = { path: '/', redirect: `${initialState.menuArray[0].path}`, exact: true };

      // @ts-ignore
      route.children.push(first);
      // @ts-ignore
      route.routes.push(first);

      for (let i = 0; i < initialState.menuArray.length; i += 1) {
        const menu = initialState.menuArray[i];
        // @ts-ignore
        route.children.push(menu);
        // @ts-ignore
        route.routes.push(menu);
      }

      // 旧路由长度
      const ol = route.routes.length - initialState.menuArray.length;
      if (ol > 0) {
        // 移出旧路由
        route.children.splice(0, ol);
        route.routes.splice(0, ol);
      }

      setInitialState({ ...initialState, settings: { ...settings }, routerLoad: true });
    }
  }, [initialState, initialState?.menuArray]);

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
      onMenuHeaderClick={() => history.push('/')}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (!menuItemProps.path || location.pathname === menuItemProps.path) {
          return defaultDom;
        }

        if (menuItemProps.isUrl) {
          return (
            <a target={menuItemProps.target} href={menuItemProps.path}>
              {menuItemProps.name}
            </a>
          );
        }

        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      itemRender={(nr, params, routes, paths) => {
        const first = routes.indexOf(nr) === 0;
        return first ? (
          <Link to={paths.join('/')}>{nr.breadcrumbName}</Link>
        ) : (
          <span>{nr.breadcrumbName}</span>
        );
      }}
      rightContentRender={() => <RightContent />}
    >
      {reload ? (
        <LoadingComponent />
      ) : (
        <WaterMark content={initialState?.user?.info?.nickname} style={{ height: '100%' }}>
          {children}
        </WaterMark>
      )}
    </ProLayout>
  );
};

export default BasicLayout;
