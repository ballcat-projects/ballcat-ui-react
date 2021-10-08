import React, { useState } from 'react';
import { Alert, Button, Card, Divider } from 'antd';
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

      <Divider>下面是Lov 多选的 Demo</Divider>
      <Lov keyword={'lov_demo_multiple'} />

      <Divider>下面是Lov 单选的 Demo</Divider>
      <Button
        type={'primary'}
        onClick={() => {
          setValue(value - 1);
        }}
      >
        切换value
      </Button>
      <span>当前值: {value}</span>
      <Lov value={value} onChange={setValue} keyword={'lov_demo'} />
    </Card>
  );
};
