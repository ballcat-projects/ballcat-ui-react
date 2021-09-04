import React, { useEffect, useState } from 'react';
import type { DictProps } from './typings';
import { useModel, getLocale } from 'umi';
import type { SysDictData, SysDictDataItem } from '@/services/ballcat/system';
import { message, Spin } from 'antd';
import { dict } from '@/services/ballcat/system';
import type { GLOBAL } from '@/typings';
import { Dict as DictCache } from '@/utils/Ballcat';

const loading = <Spin />;

const getRealName = (item: SysDictDataItem): string => {
  const lang = getLocale();
  if (item?.attributes?.languages) {
    // 存在国际化配置
    const text = item.attributes.languages[lang];
    if (text && text.length > 0) {
      // 存在正确的配置值 - 返回对应配置
      return text;
    }
  }

  return item.name;
};
const updateDict = (
  initialState: GLOBAL.Is | undefined,
  setInitialState: (initialState: GLOBAL.Is) => Promise<void>,
  data: SysDictData,
) => {
  const cache = initialState?.dict?.cache || {};
  const hashs = initialState?.dict?.hashs || {};

  // 更新数据
  cache[data.dictCode] = DictCache.toInitialStateData(data);
  hashs[data.dictCode] = data.hashCode;

  // 更新缓存
  setInitialState({ ...initialState, dict: { cache, hashs } });
  // 加载流程的数据. 不缓存在浏览器
  if (data.loading === undefined) {
    DictCache.set(data);
    DictCache.setHashs(hashs);
  }
};

const Dict = (
  props: DictProps & {
    render: (
      props: DictProps & {
        getRealName: (item: SysDictDataItem) => string;
      },
      data: SysDictData,
    ) => React.ReactNode;
  },
) => {
  const { value, onChange, code, render } = props;
  const { initialState, setInitialState } = useModel('@@initialState');
  const [dictData, setDictData] = useState<SysDictData | undefined>(undefined);
  const [dom, setDom] = useState<React.ReactNode>(loading);

  useEffect(() => {
    // @ts-ignore
    let data = initialState?.dict?.cache[code];

    if (data) {
      // 只解析非加载数据
      if (!data.loading) {
        setDictData(data);
      }
    }
    // 发起请求获取数据
    else {
      // @ts-ignore
      data = { dictCode: code, loading: true };
      // @ts-ignore
      updateDict(initialState, setInitialState, data);
      // @ts-ignore
      dict.dictData([code]).then((res) => {
        if (res.data.length > 0) {
          [data] = res.data;
          updateDict(initialState, setInitialState, data);
        } else {
          message.error(`字典: ${code} 数据加载失败!`);
          // @ts-ignore
          updateDict(initialState, setInitialState, { dictCode: code, loading: false });
        }
      });
    }
  }, [code, initialState, setInitialState]);

  useEffect(() => {
    // 存在且不是在加载
    if (dictData && !dictData.loading) {
      setDom(render({ value, onChange, code, getRealName }, dictData));
    } else {
      setDom(loading);
    }
  }, [value, onChange, code, dictData, render]);

  return <>{dom} </>;
};

export default Dict;
