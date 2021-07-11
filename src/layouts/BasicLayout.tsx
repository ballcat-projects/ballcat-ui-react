import type {
  BasicLayoutProps as ProLayoutProps,
  MenuDataItem,
  Settings,
} from '@ant-design/pro-layout';
import ProLayout, { WaterMark } from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import RightContent from '@/components/RightContent';
import { dynamic, history, Link, useIntl, useModel } from 'umi';
import LoadingComponent from '@ant-design/pro-layout/es/PageLoading';
import HeaderContent from '@/components/HeaderContent';
import settings from '../../config/defaultSettings';

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
  const { formatMessage } = useIntl();
  const { initialState, setInitialState } = useModel('@@initialState');

  useEffect(() => {
    if (!initialState?.routerLoad && initialState?.menuArray) {
      const c404 = {
        component: dynamic({
          loader: () => import('@/pages/exception/404'),
          loading: LoadingComponent,
        }),
      };
      initialState.menuArray.push(c404);

      if (!route.children) {
        route.children = [];
      }
      if (!route.routes) {
        route.routes = [];
      }
      for (let i = 0; i < initialState.menuArray.length; i += 1) {
        const menu = initialState.menuArray[i];
        // @ts-ignore
        route.children.push(menu);
        // @ts-ignore
        route.routes.push(menu);
      }

      setInitialState({ ...initialState, routerLoad: true });
    }
  }, [initialState]);

  return (
    <ProLayout
      logo={'./logo.svg'}
      {...settings}
      formatMessage={formatMessage}
      {...props}
      collapsedButtonRender={false}
      collapsed={collapsed}
      onCollapse={setCollapsed}
      headerContentRender={() => <HeaderContent collapsed={collapsed} onCollapse={setCollapsed} />}
      onPageChange={async () => {
        // 如果没有登录，重定向到 login
        if (!initialState?.user?.info && location.pathname !== '/user/login') {
          history.push('/user/login');
        }
      }}
      onMenuHeaderClick={() => history.push('/')}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (
          menuItemProps.isUrl ||
          !menuItemProps.path ||
          location.pathname === menuItemProps.path
        ) {
          return defaultDom;
        }
        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      breadcrumbRender={(routers = []) => [
        {
          path: '/',
          breadcrumbName: formatMessage({ id: 'menu.home' }),
        },
        ...routers,
      ]}
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
      <WaterMark content={initialState?.user?.info?.nickname} style={{ height: '100%' }}>
        {children}
      </WaterMark>
    </ProLayout>
  );
};

export default BasicLayout;
