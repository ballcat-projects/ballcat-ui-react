import React, { useState } from 'react';
import { Alert, Card, Divider } from 'antd';
import Lov from '@/components/Lov';

export default (): React.ReactNode => {
  const [value, setValue] = useState<any>(34);

  return (
    <Card>
      <Alert
        message="React 版本弃用服务端的Lov组件, 采用纯前端形式!"
        type="error"
        showIcon
        banner
      />

      <Divider>下面是Lov的 Demo</Divider>
      <Lov value={value} setValue={setValue} keyword={'lov_demo_multiple'} />
    </Card>
  );
};
