import React, { useState, useEffect } from 'react';
import { settings } from '@/utils/ConfigUtils';
import { getIconFile } from '@/services/ant-design-pro/icon';
import Icon from './icon';
import { Input, Spin } from 'antd';

const jsExp = new RegExp('id=".+?"', 'g');
const iconIdArray: string[] = [];
const iconArray: React.ReactNode[] = [];

export type IconSelectProps = {
  value?: string;
  onChange?: (val: string) => void;
};

const IconSelect = (props: IconSelectProps) => {
  const { value, onChange = () => {} } = props;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (iconIdArray.length === 0) {
      setLoading(true);
      // 初始化
      getIconFile(settings.iconfontUrl)
        .then((res) => {
          res.match(jsExp)?.forEach((reg) => {
            const regStr = reg.toString();
            const id = regStr.substring(4, regStr.length - 1);
            iconIdArray.push(id);
            iconArray.push(<Icon type={id} />);
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  return (
    <>
      <Spin spinning={loading}>
        <Input
          readOnly
          defaultValue={value}
          addonAfter={<Icon type="setting" />}
          onChange={(e) => {
            onChange(e.target.value);
          }}
        />
      </Spin>
    </>
  );
};

export default IconSelect;
