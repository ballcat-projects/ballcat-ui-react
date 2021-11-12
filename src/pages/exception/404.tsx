import { Button, Result } from 'antd';
import React from 'react';
import { history, useModel } from 'umi';

const NoFoundPage: React.FC = () => {
  const { firstPath } = useModel('dynamic-route');

  return (
    <Result
      status="404"
      title="404"
      subTitle="抱歉，您访问的页面不存在!"
      extra={
        <Button
          type="primary"
          onClick={() => {
            history.push(firstPath || '/');
          }}
        >
          返回首页
        </Button>
      }
    />
  );
};

export default NoFoundPage;
