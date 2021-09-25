import type { DictSelectProps } from './typings';
import Dict from './Dict';
import type { SysDictDataItem } from '@/services/ballcat/system';
import { Select } from 'antd';
import React from 'react';

const getSingleDom = (
  { showTextColor, disabledFilter = () => false }: DictSelectProps,
  item: SysDictDataItem,
  text: string,
) => {
  const disabled = disabledFilter(item);
  const color = showTextColor ? item?.attributes?.textColor : undefined;

  return (
    <Select.Option key={item.id} disabled={disabled} style={{ color }} value={item.realVal}>
      {text}
    </Select.Option>
  );
};

const DictSelect = (props: DictSelectProps) => {
  const { multipar, disabled, allowClear, placeholder, showFilter = () => true } = props;

  return (
    <Dict
      {...props}
      render={({ value, onChange, getRealName, style }, { hashCode, dictItems }) => {
        const optionArray: React.ReactNode[] = [];

        for (let index = 0; index < dictItems.length; index += 1) {
          const item = dictItems[index];
          if (showFilter(item)) {
            optionArray.push(getSingleDom(props, item, getRealName(item)));
          }
        }

        return (
          <Select
            placeholder={placeholder}
            allowClear={allowClear}
            disabled={disabled}
            mode={multipar ? 'tags' : undefined}
            key={hashCode}
            value={value}
            onChange={onChange}
            style={{ ...style }}
          >
            {optionArray}
          </Select>
        );
      }}
    />
  );
};

export default DictSelect;
