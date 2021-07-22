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
import settings from '../../config/defaultSettings';
import { Breadcrumb } from 'antd';
import Footer from '@/components/Footer';

export type BasicLayoutProps = {
  breadcrumbNameMap: Record<string, MenuDataItem>;
  route: ProLayoutProps['route'] & {
    authority: string[];
  };
  settings: Settings;
} & ProLayoutProps;

const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] =>
  menuList.map((item) => {
    return {
      ...item,
      children: item.children ? menuDataRender(item.children) : undefined,
    };
  });

// @ts-ignore
const breadcrumbRender = (
  path: string,
  routes: { locale: boolean | undefined; path: string; name: string; routes: any[] }[],
  fm: (id: string, dm?: string) => string,
) => {
  const list = [];
  for (let i = 0; i < routes.length; i += 1) {
    const route = routes[i];
    const { path: rp, name: rn, locale } = route;
    if (rp && rp !== '/') {
      if (path.startsWith(rp)) {
        let name = rn;
        if (locale === undefined || locale === null || locale) {
          // 国际化失败, 则用key展示
          name = fm(`menu.${rn}`, rn);
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
    },
  } = props;

  const [collapsed, setCollapsed] = useState(false);
  const [reload, setReload] = useState(false);
  const { formatMessage } = useIntl();
  const { initialState, setInitialState } = useModel('@@initialState');

  useEffect(() => {
    if (!route.children) {
      route.children = [];
    }
    if (!route.routes) {
      route.routes = [];
    }

    if (!initialState?.routerLoad && initialState?.menuArray) {
      for (let i = 0; i < initialState.menuArray.length; i += 1) {
        const menu = initialState.menuArray[i];
        // @ts-ignore
        route.children.push(menu);
        // @ts-ignore
        route.routes.push(menu);
      }

      setInitialState({ ...initialState, settings: { ...settings }, routerLoad: true });
    }
  }, [initialState]);

  const fm = (id: string, defaultMessage?: string) => {
    return formatMessage({ id, defaultMessage });
  };

  return (
    <ProLayout
      logo={'./logo.svg'}
      {...settings}
      {...initialState?.settings}
      formatMessage={formatMessage}
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
            breadcrumbData={breadcrumbRender(location.pathname, route.routes, fm)}
            collapsed={collapsed}
            onCollapse={setCollapsed}
            onReload={setReload}
            fm={fm}
          />
        );
      }}
      onPageChange={async () => {
        // 如果没有登录，重定向到 login
        if (!initialState?.user?.info && location.pathname !== '/user/login') {
          history.push('/user/login');
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
      menuDataRender={menuDataRender}
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
