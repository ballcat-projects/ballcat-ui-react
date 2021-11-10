import React, { useEffect, useState } from 'react';
import type { DictProps } from './typings';
import { useModel, getLocale } from 'umi';
import type { SysDictData, SysDictDataItem } from '@/services/ballcat/system';
import { Spin } from 'antd';

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
  const { initializing, get } = useModel('dict');
  const [dictData, setDictData] = useState<SysDictData | undefined>(undefined);
  const [dom, setDom] = useState<React.ReactNode>(loading);

  useEffect(() => {
    if (!initializing) {
      setDictData(get(code));
    }
  }, [get, code, initializing]);

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
