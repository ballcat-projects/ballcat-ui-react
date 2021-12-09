import { useState } from 'react';
import type { LatLng } from '@/components/Map';
import Map from '@/components/Map';
import { Radio, Space, Switch } from 'antd';

export default () => {
  const [type, setType] = useState<'card' | 'modal'>('card');
  const [show, setShow] = useState(false);
  const [value, setValue] = useState<LatLng>();

  return (
    <>
      <Space>
        <Radio.Group
          optionType="button"
          options={[
            { label: '卡片', value: 'card' },
            { label: '对话框', value: 'modal' },
          ]}
          value={type}
          onChange={(e) => {
            setType(e.target.value);
          }}
        />
        <Switch
          checkedChildren="显示"
          unCheckedChildren="隐藏"
          onChange={(e) => {
            setShow(e.valueOf());
          }}
        />
        <span>选中点经纬度(纬度,经度): {`${value?.lat || 0},${value?.lng || 0}`}</span>
      </Space>
      <Map.Marker type={type} show={show} onShow={setShow} value={value} onChange={setValue} />
    </>
  );
};
