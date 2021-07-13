import React from 'react';
import { Alert, Card } from 'antd';

export default (): React.ReactNode => {
  return (
    <Card>
      <Alert
        message="React 版本弃用服务端的Lov组件, 采用纯前端形式!"
        type="error"
        showIcon
        banner
      />
    </Card>
  );
};
