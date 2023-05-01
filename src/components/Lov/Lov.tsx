import LovModal from '@/components/Lov/LovModal';
import { EllipsisOutlined } from '@ant-design/icons';
import { Button, Input, Select } from 'antd';
import { useCallback, useEffect, useState } from 'react';

import * as lovMap from './options';

import type { LovConfig, LovProps } from './typing';

const caches: Record<string, LovConfig<any, any>> = {};

const keys = Object.keys(lovMap);

// eslint-disable-next-line no-restricted-syntax
for (const key of keys) {
  caches[key] = lovMap[key];
}

export const Lov = <V extends string | number, E = any>(props: LovProps<V, E>) => {
  const { value, onChange, keyword, overwriteConfig } = props;
  const config = { ...caches[keyword], ...overwriteConfig } as LovConfig<V, E>;

  const [show, setShow] = useState<boolean>(false);
  const [lovValue, setLovValue] = useState<V[]>();
  const [modalKey, setModalKey] = useState<number>(1);

  // 在这里更新value之后. lovModal 内部没有更新数据. 展示会有问题
  // 所以每次在这里更新value之后就更新key, 让lovModal组件销毁, 重新创建一个. 达到强制更新的目的
  const keyStep = useCallback(() => {
    setModalKey(modalKey + 1);
  }, [modalKey]);

  const lovValueChange = useCallback(
    (val?: V | V[]) => {
      if (onChange) {
        onChange(val);
      } else if (val) {
        setLovValue(val instanceof Array ? val : [val]);
      } else {
        setLovValue([]);
      }
    },
    [onChange],
  );

  useEffect(() => {
    if (value) {
      // 值为数组
      if (value instanceof Array) {
        // 存在多个值
        if (value.length > 0) {
          setLovValue(config.multiple ? [...value] : [value[0]]);
        } else {
          setLovValue([]);
        }
      }
      // 值为单个
      else {
        setLovValue([value]);
      }
    } else {
      setLovValue([]);
    }
    keyStep();
  }, [config.multiple, value]);

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
              lovValueChange(undefined);
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
          <EllipsisOutlined style={{ fontSize: '16px' }} />
        </Button>
      </Input.Group>
      <LovModal<V, E>
        {...props}
        {...config}
        value={lovValue}
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
