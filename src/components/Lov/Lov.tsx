import React, { useState, useEffect } from 'react';
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
  const { value, onChange } = props;
  const [show, setShow] = useState<boolean>(false);
  const [lovValue, setLovValue] = useState<any>();
  const [modalKey, setModalKey] = useState<number>(1);

  const lovValueChange = (val: any) => {
    if (onChange) {
      onChange(val);
    } else {
      setLovValue(val);
    }
  };

  // 在这里更新value之后. lovModal 内部没有更新数据. 展示会有问题
  // 所以每次在这里更新value之后就更新key, 让lovModal组件销毁, 重新创建一个. 达到强制更新的目的
  const keyStep = () => {
    setModalKey(modalKey + 1);
  };

  useEffect(() => {
    if (value) {
      setLovValue(value instanceof Array ? [...value] : [value]);
    } else {
      setLovValue(value);
    }
  }, [value]);

  return (
    <div>
      <Input.Group compact>
        <Select
          allowClear
          mode={'tags'}
          value={lovValue}
          style={{ width: 'calc(100% - 40px)' }}
          open={false}
          onDeselect={(val: any) => {
            if (lovValue === undefined || lovValue === null) {
              return;
            }

            // 不是多选.
            if (!config.multiple) {
              // 相等, 处理
              if (lovValue[0] === val) {
                lovValueChange(undefined);
                keyStep();
              }
              return;
            }

            // 多选, 相等
            if (lovValue === val) {
              // 清空选择内容
              lovValueChange([]);
              keyStep();
              return;
            }

            // 从选中内容中移除val
            const index = lovValue.indexOf(val);
            if (index !== -1) {
              lovValue.splice(index, 1);
              lovValueChange([...lovValue]);
              keyStep();
            }
          }}
          onClear={() => {
            lovValueChange(config.multiple ? [] : undefined);
            keyStep();
          }}
          onClick={() => setShow(true)}
        />
        <Button
          style={{ paddingLeft: '5px', paddingRight: '5px' }}
          onClick={() => {
            setShow(true);
          }}
        >
          <Icon style={{ fontSize: '16px' }} type="ellipsis" />
        </Button>
      </Input.Group>
      <LovModal
        {...props}
        {...config}
        // 通过更新key来达到组件销毁的目的
        key={`lovModalKey-${modalKey}`}
        show={show}
        setShow={setShow}
        setValue={lovValueChange}
      />
    </div>
  );
};

export default Lov;
