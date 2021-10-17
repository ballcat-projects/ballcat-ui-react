import type { MenuDataItem } from '@ant-design/pro-layout';
import { router } from '@/services/ant-design-pro/api';
import LoadingComponent from '@ant-design/pro-layout/es/PageLoading';
import { dynamic, history } from 'umi';
import type { GLOBAL } from '@/typings';

export type BallcatMenuItem = {
  id: number;
  children: MenuDataItem[];
  routes: MenuDataItem[];
  component: any;
  path: string;
  redirect?: string;
  meta?: Record<string, any>;
  exact?: boolean;
  name: string;
} & MenuDataItem;

let menuDict: Record<string, BallcatMenuItem> = {};

export async function getMenu() {
  const { data: remoteList } = await router();
  menuDict = {};
  return serializationRemoteList(remoteList, 0, '');
}

function getRedirectPath(menu: BallcatMenuItem): string {
  let redirectPath = menu.path;

  if (menu.children && menu.children.length > 0) {
    const cm = menu.children[0];
    // 非菜单页. 寻找下级
    if (!cm.exact) {
      return getRedirectPath(cm as BallcatMenuItem);
    }

    redirectPath = cm.path || redirectPath;
  }

  return redirectPath;
}

export function serializationRemoteList(list: GLOBAL.Router[], pId: number, path: string) {
  const menus: MenuDataItem[] = [];

  list.forEach((val) => {
    if (val.parentId === pId) {
      const menuPath = val.path.startsWith('/') ? val.path : `/${val.path}`;
      // @ts-ignore
      const menu: BallcatMenuItem = {
        id: val.id,
        hideInMenu: Boolean(val.hidden),
        icon: val.icon,
        locale: false,
        path: `${path}${menuPath}`,
        name: val.title,
        // 只有菜单页要求全匹配
        exact: val.type === 1,
        meta: val,
      };

      // 目录处理
      if (val.type === 0) {
        const childrenArray = serializationRemoteList(list, val.id, menu.path);
        // 需要添加一个404的路由, 否则 二级,三级的不存在路由 会在右边展示空白
        childrenArray.push({
          component: dynamic({
            loader: () => import('@/pages/exception/404'),
            loading: LoadingComponent,
          }),
        });

        menu.routes = childrenArray;
        menu.children = childrenArray;
        menu.meta = { ...menu.meta, redirectPath: getRedirectPath(menu) };
        // menu.redirect = getRedirectPath(menu)
        // menu.path = ''
      }
      // 菜单处理
      else if (val.type === 1) {
        let component: any;
        // 组件
        if (val.targetType === 1) {
          component = dynamic({
            loader: () => {
              return new Promise((resolve) => {
                import(`@/pages/${val.uri}`)
                  .then((page) => {
                    resolve(page);
                  })
                  .catch((err) => {
                    // eslint-disable-next-line no-console
                    console.error('页面加载异常', err);
                    import(`@/pages/exception/error`).then((errPage) => resolve(errPage));
                  });
              });
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
        menuDict[menu.path] = menu;
        menu.component = component;
      }
      menus.push(menu);
    }
  });

  return menus;
}

//  重定向，并且将当前的 url 保存
export function redirect(arg: string) {
  const path = arg.startsWith('/') ? arg : `/${arg}`;
  const { pathname } = history.location;
  if (path !== pathname) {
    goto(`${path}?redirect=${history.location.pathname}`);
  }
}

// 网站内部跳转
export function goto(path: string) {
  history.push(path);
}

const RouteUtils = {
  getMenu,
  getRedirectPath,
  redirect,
  goto,
  getMenuDict: () => menuDict,
};

export default RouteUtils;
