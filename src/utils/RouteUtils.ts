import type { MenuDataItem } from '@ant-design/pro-layout';
import React from 'react';
import { Icon } from '@/components/Icon';
import { router } from '@/services/ant-design-pro/api';
import LoadingComponent from '@ant-design/pro-layout/es/PageLoading';
import { plugin } from '@@/core/plugin';
import routes from '../../config/routes';
import { ApplyPluginsType, dynamic, history } from 'umi';
import type { GLOBAL } from '@/typings';

export async function getMenu() {
  const { data: remoteList } = await router();
  return serializationRemoteList(remoteList, 0, '');
}

export function serializationRemoteList(list: GLOBAL.Router[], pId: number, path: string) {
  const menus: MenuDataItem[] = [];

  list.forEach((val) => {
    if (val.parentId === pId) {
      const menuPath = val.path.startsWith('/') ? val.path : `/${val.path}`;
      // @ts-ignore
      const menu: MenuDataItem & {
        children: MenuDataItem[];
        routes: MenuDataItem[];
        component: any;
      } = {
        hideInMenu: val.hidden,
        icon: val.icon
          ? React.createElement(Icon, { type: `ballcat-icon-${val.icon}` })
          : undefined,
        locale: false,
        path: `${path}${menuPath}`,
        name: val.title,
        extra: true,
        meta: val,
      };

      // 目录处理
      if (val.type === 0) {
        const childrenArray = serializationRemoteList(list, val.id, menuPath);
        menu.routes = childrenArray;
        menu.children = childrenArray;
      }
      // 菜单处理
      else if (val.type === 1) {
        let component: any;
        // 组件
        if (val.targetType === 1) {
          component = dynamic({
            // loader: () => import('@/pages/system/role'),
            loader: () => {
              // TODO 导入模块异常时, 展示异常页面. import是异步.无法捕获.
              return import(`@/pages/${val.uri}`);
            },
            loading: LoadingComponent,
          });
        }
        // 内联
        else if (val.targetType === 2) {
          component = dynamic({
            loader: () => import('@/components/Inline'),
            loading: LoadingComponent,
          });
        }
        menu.component = component;
      }
      menus.push(menu);
    }
  });

  return menus;
}

export async function updateRouter() {
  if (history.location.pathname !== '/user/login' && localStorage.getItem('ballcat_user')) {
    getMenu().then((res) => {
      plugin.applyPlugins({
        key: 'patchRoutes',
        type: ApplyPluginsType.event,
        args: { routes, remoteRoutes: res },
      });
    });
  }
}
