import React from 'react';
import { Alert, Card, Divider } from 'antd';
import Lov from '@/components/Lov';

export default (): React.ReactNode => {
  return (
    <Card>
      <Alert
        message="React 版本弃用服务端的Lov组件, 采用纯前端形式!"
        type="error"
        showIcon
        banner
      />

      <Divider>下面是Lov的 Demo</Divider>
      <Lov keyword={'lov_demo'} />
    </Card>
  );
};
