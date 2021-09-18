import React, { useState } from 'react';
import LovModal from '@/components/Lov/LovModal';

import * as lovMap from '../../../config/lov';
import type { LovConfig, LovProps } from './typing';
import { Button, Input, Select } from 'antd';
import Icon from '@/components/Icon';

const cache: Record<string, LovConfig<any>> = {};
// 使用 Object.keys 用来遍历模块
const keys = Object.keys(lovMap);

for (let i = 0; i < keys.length; i += 1) {
  const lov: LovConfig<Record<string, any>> = lovMap[keys[i]];
  cache[lov.keyword] = lov;
}

const Lov: React.FC<LovProps> = (props) => {
  const config = cache[props.keyword];
  const { value, setValue } = props;
  const [show, setShow] = useState<boolean>(false);

  return (
    <div>
      <Input.Group compact>
        <Select
          allowClear
          mode={'tags'}
          value={value && (value instanceof Array ? [...value] : [value])}
          style={{ width: 'calc(100% - 40px)' }}
          open={false}
          onDeselect={(val: any) => {
            if (value === undefined || value === null) {
              return;
            }

            // 不是多选.
            if (!config.multiple) {
              // 相等, 处理
              if (value === val) {
                setValue(undefined);
              }
              return;
            }

            // 多选, 相等
            if (value === val) {
              // 清空选择内容
              setValue([]);
              return;
            }

            // 从选中内容中移除val
            const index = value.indexOf(val);
            if (index !== -1) {
              value.splice(index, 1);
              setValue([...value]);
            }
          }}
          onClear={() => {
            setValue(config.multiple ? [] : undefined);
          }}
          onClick={() => setShow(true)}
        />
        <Button
          style={{ paddingLeft: '5px', paddingRight: '5px' }}
          onClick={() => {
            setShow(true);
          }}
        >
          <Icon style={{ fontSize: '16px' }} type={'ellipsis'} />
        </Button>
      </Input.Group>
      <LovModal {...props} {...config} show={show} setShow={setShow} setValue={setValue} />
    </div>
  );
};

export default Lov;
