import type { MenuDataItem } from '@ant-design/pro-layout';
import React from 'react';
import { Icon } from '@/components/Icon';
import { router } from '@/services/ant-design-pro/api';
import LoadingComponent from '@ant-design/pro-layout/es/PageLoading';
import { dynamic, history } from 'umi';
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
        // 只有菜单页要求全匹配
        exact: val.type === 1,
        meta: val,
      };

      // 目录处理
      if (val.type === 0) {
        const childrenArray = serializationRemoteList(list, val.id, menuPath);
        // 需要添加一个404的路由, 否则 二级,三级的不存在路由 会在右边展示空白
        childrenArray.push({
          component: dynamic({
            loader: () => import('@/pages/exception/404'),
            loading: LoadingComponent,
          }),
        });
        menu.routes = childrenArray;
        menu.children = childrenArray;
      }
      // 菜单处理
      else if (val.type === 1) {
        let component: any;
        // 组件
        if (val.targetType === 1) {
          component = dynamic({
            loader: () => {
              // TODO 导入模块异常时, 展示异常页面. import是异步.无法捕获.
              return import(`@/pages/${val.uri}`);
            },
            loading: LoadingComponent,
          });
        }
        // 内链
        else if (val.targetType === 2) {
          component = dynamic({
            loader: () => import('@/components/Inline'),
            loading: LoadingComponent,
          });
        }
        // 外链
        else {
          menu.target = '_blank';
          menu.path = val.uri;
        }
        menu.component = component;
      }
      menus.push(menu);
    }
  });

  return menus;
}

export function redirect(path: string) {
  //  退出登录，并且将当前的 url 保存
  const { pathname } = history.location;
  history.push(`${path}?redirect=${pathname}`);
}
