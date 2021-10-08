import Dict from './Dict';
import type { SysDictDataItem } from '@/services/ballcat/system';
import { Checkbox } from 'antd';
import React from 'react';
import type { DictCheckboxProps } from '.';

const getSingleDom = (
  { showTextColor, disabledFilter = () => false }: DictCheckboxProps,
  item: SysDictDataItem,
  text: string,
) => {
  const disabled = disabledFilter(item);
  const color = showTextColor ? item?.attributes?.textColor : undefined;

  return (
    <Checkbox key={item.id} disabled={disabled} value={item.realVal} style={{ color }}>
      {text}
    </Checkbox>
  );
};

const DictCheckbox = (props: DictCheckboxProps) => {
  const { disabled, showFilter = () => true } = props;

  return (
    <Dict
      {...props}
      render={({ value, onChange, getRealName, style }, { hashCode, dictItems }) => {
        const checkboxArray: React.ReactNode[] = [];

        for (let index = 0; index < dictItems.length; index += 1) {
          const item = dictItems[index];
          if (showFilter(item)) {
            checkboxArray.push(getSingleDom(props, item, getRealName(item)));
          }
        }

        return (
          <Checkbox.Group
            disabled={disabled}
            key={hashCode}
            value={value}
            onChange={onChange}
            style={{ ...style }}
          >
            {checkboxArray}
          </Checkbox.Group>
        );
      }}
    />
  );
};

export default DictCheckbox;
