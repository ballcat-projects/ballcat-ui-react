import type { DictRadioProps } from './typings';
import Dict from './Dict';
import type { SysDictDataItem } from '@/services/ballcat/system';

import { Radio } from 'antd';
import React from 'react';

const getSingleDom = (
  { radioType, showTextColor, disabledFilter = () => false }: DictRadioProps,
  item: SysDictDataItem,
  text: string,
) => {
  const disabled = disabledFilter(item);
  const color = showTextColor ? item?.attributes?.textColor : undefined;
  if (radioType === 'button') {
    return (
      <Radio.Button key={item.id} disabled={disabled} style={{ color }} value={item.realVal}>
        {text}
      </Radio.Button>
    );
  }
  return (
    <Radio key={item.id} disabled={disabled} value={item.realVal} style={{ color }}>
      {text}
    </Radio>
  );
};

const DictRadio = (props: DictRadioProps) => {
  const { disabled, showFilter = () => true } = props;

  return (
    <Dict
      {...props}
      render={({ value, onChange, getRealName, style }, { hashCode, dictItems }) => {
        const radioArray: React.ReactNode[] = [];

        for (let index = 0; index < dictItems.length; index += 1) {
          const item = dictItems[index];
          if (showFilter(item)) {
            radioArray.push(getSingleDom(props, item, getRealName(item)));
          }
        }

        return (
          <Radio.Group
            disabled={disabled}
            key={hashCode}
            value={value}
            onChange={onChange}
            style={{ ...style }}
          >
            {radioArray}
          </Radio.Group>
        );
      }}
    />
  );
};

export default DictRadio;
