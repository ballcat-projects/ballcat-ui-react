import React, { useState } from 'react';
import { Alert, Card, Divider } from 'antd';
import Lov from '@/components/Lov';

export default (): React.ReactNode => {
  const [multipleValue, setMultipleValue] = useState<any>(34);
  const [value, setValue] = useState<any>(34);

  return (
    <Card>
      <Alert
        message="React 版本弃用服务端的Lov组件, 采用纯前端形式!"
        type="error"
        showIcon
        banner
      />

      <Divider>下面是Lov 多选的 Demo</Divider>
      <Lov value={multipleValue} setValue={setMultipleValue} keyword={'lov_demo_multiple'} />

      <Divider>下面是Lov 单选的 Demo</Divider>
      <Lov value={value} setValue={setValue} keyword={'lov_demo'} />
    </Card>
  );
};
