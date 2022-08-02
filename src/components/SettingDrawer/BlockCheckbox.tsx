import React, { useEffect, useState } from 'react';
import { Tooltip } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { getFormatMessage } from './index';

export type BlockCheckboxProps = {
  value: string;
  onChange: (key: string) => void;
  list?: {
    titleKey: string;
    key: string;
  }[];
  configType: string;
  prefixCls: string;
};

const keyPrefix = {
  theme: 'app.setting.pagestyle.',
  layout: 'app.setting.',
};

const BlockCheckbox: React.FC<BlockCheckboxProps> = ({
  value,
  configType,
  onChange,
  list,
  prefixCls,
}) => {
  const baseClassName = `${prefixCls}-drawer-block-checkbox`;
  const [dom, setDom] = useState<JSX.Element[]>([]);
  useEffect(() => {
    const domList = (list || []).map((item) => (
      <Tooltip
        title={getFormatMessage()({ id: `${keyPrefix[configType]}${item.titleKey}` })}
        key={item.key}
      >
        <div
          className={classNames(
            `${baseClassName}-item`,
            `${baseClassName}-item-${item.key}`,
            `${baseClassName}-${configType}-item`,
          )}
          onClick={() => onChange(item.key)}
        >
          <CheckOutlined
            className={`${baseClassName}-selectIcon`}
            style={{
              display: value === item.key ? 'block' : 'none',
            }}
          />
        </div>
      </Tooltip>
    ));
    setDom(domList);
  }, [value, list?.length]);
  return (
    <div
      className={baseClassName}
      style={{
        minHeight: 42,
      }}
    >
      {dom}
    </div>
  );
};

export default BlockCheckbox;
