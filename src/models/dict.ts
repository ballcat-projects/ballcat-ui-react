import type { SysDictData } from '@/services/ballcat/system';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { dict } from '@/services/ballcat/system';
import { Dict } from '@/utils/Ballcat';
import I18n from '@/utils/I18nUtils';
import { useModel } from 'umi';
import { debounce } from 'lodash';

let asyncCache: Record<string, SysDictData> = {};

const putAsync = (data: SysDictData) => {
  asyncCache[data.dictCode] = data;
};

export default () => {
  const { addEventListen, removeEventListen } = useModel('websocket');
  const { initialState } = useModel('@@initialState');

  const [cache, setCache] = useState<Record<string, SysDictData>>({});
  const [initializing, setInitializing] = useState(true);

  const toLocal = useMemo(
    () =>
      debounce(() => {
        const newHashs = {};
        Object.keys(asyncCache).forEach((code) => {
          const data = asyncCache[code];
          if (!data.loading) {
            newHashs[code] = data.hashCode;
            Dict.set(data);
          }
        });
        Dict.setHashs(newHashs);
      }, 500),
    [],
  );

  const sync = useCallback(
    (data: SysDictData) => {
      if (data.loading) {
        return;
      }
      const dictData = Dict.toData(data);
      const newCache = { ...cache };
      newCache[data.dictCode] = dictData;
      setCache(newCache);
      asyncCache[data.dictCode] = dictData;
      toLocal();
    },
    [cache, toLocal],
  );

  const init = useCallback(async (forcibly = false) => {
    // 非强制更新. 更新条件判断
    if (!forcibly && Object.keys(asyncCache).length > 0) {
      return;
    }
    // @ts-ignore
    asyncCache = { loading: {} };
    setInitializing(true);
    // 无效字典删除
    const localHashs = Dict.getHashs();
    // 校验hash是否过期
    const expireHashs = (await dict.validHash(localHashs)).data;
    expireHashs.forEach((code) => {
      // 删除过期hash
      delete localHashs[code];
      Dict.del(code);
    });
    // 更新hash缓存
    Dict.setHashs(localHashs);
    const newCache = {};
    asyncCache = {};
    // 缓存数据加载
    Object.keys(localHashs).forEach((code) => {
      const data = Dict.get(code);
      if (data && !data.loading) {
        newCache[code] = Dict.toData(data);
        asyncCache[code] = newCache[code];
      }
    });

    setCache(newCache);
    setInitializing(false);
  }, []);

  const load = useMemo(
    () => (code: string) =>
      dict.dictData([code]).then((res) => {
        if (res.data.length > 0) {
          sync(res.data[0]);
        } else {
          I18n.error({ key: 'dict.load.fail', params: { code } });
        }
      }),
    [sync],
  );

  const get = useCallback(
    (code: string) => {
      if (cache[code] || asyncCache[code]) {
        return cache[code] || asyncCache[code];
      }
      // 加载中
      // @ts-ignore
      putAsync({ dictCode: code, loading: true });
      load(code);
      return asyncCache[code];
    },
    [cache],
  );

  useEffect(() => {
    if (initialState?.user?.access_token) {
      init(true);
    }
  }, [init, initialState]);

  // 添加字典更新事件
  useEffect(() => {
    const callback = () => {
      // 强制初始化
      init(true);
    };
    // 添加订阅
    addEventListen('dict-change', callback);
    return () => {
      // 移除
      removeEventListen('dict-change', callback);
    };
  }, [addEventListen, init, removeEventListen]);

  return { initializing, init, load, get };
};
