import React, { useState } from 'react';
import LovModal from '@/components/Lov/LovModal';

import * as lovMap from '../../../config/lov';
import type { LovConfig, LovProps } from './typing';
import { Button, Input, Select } from 'antd';
import { Icon } from '@/components/Icon';

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
          value={value instanceof Array ? [...value] : [value]}
          style={{ width: 'calc(100% - 40px)' }}
          open={false}
        />
        <Button
          style={{ paddingLeft: '5px', paddingRight: '5px' }}
          onClick={() => {
            setShow(true);
          }}
        >
          <Icon style={{ color: '#1890ff', fontSize: '26px' }} type={'ballcat-icon-MoreCircle'} />
        </Button>
      </Input.Group>
      <LovModal {...props} {...config} show={show} setShow={setShow} setValue={setValue} />
    </div>
  );
};

export default Lov;
