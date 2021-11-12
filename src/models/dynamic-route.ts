import { useCallback, useState, useEffect } from 'react';
import { useModel, dynamic } from 'umi';
import type { ExpandRoute } from '@/utils/RouteUtils';
import { getRoute } from '@/utils/RouteUtils';
import LoadingComponent from '@ant-design/pro-layout/es/PageLoading';
import I18n from '@/utils/I18nUtils';

const getFirstUrl = (menuArray: ExpandRoute[]): string => {
  const menu = menuArray[0];
  if (menu.children && menu.children.length > 0) {
    return getFirstUrl(menu.children);
  }

  return `${menu.path}`;
};

export default () => {
  const { initialState } = useModel('@@initialState');
  const [routeArray, setMenuArray] = useState<ExpandRoute[]>([]);
  const [firstPath, setMenuFirst] = useState<string>();
  const [load, setLoad] = useState<boolean>(false);

  const refresh = useCallback(async () => {
    setLoad(false);
    const newMenuArray: ExpandRoute[] = [];
    await getRoute()
      .then((resMenuArray) => {
        newMenuArray.push(...resMenuArray);
        newMenuArray.push({
          component: dynamic({
            loader: () => import('@/pages/exception/404'),
            loading: LoadingComponent,
          }),
        });
        setMenuArray(newMenuArray);
        setMenuFirst(getFirstUrl(newMenuArray));
      })
      .catch(() => {
        I18n.error('menu.load.failed');
      });
  }, []);

  useEffect(() => {
    if (initialState?.user?.access_token) {
      refresh();
    }
  }, [initialState, refresh]);

  return { routeArray, firstPath, refresh, load, setLoad };
};
