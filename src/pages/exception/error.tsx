import { Button, Result } from 'antd';
import React from 'react';
import { history, useModel } from 'umi';

const ErrorPage: React.FC = () => {
  const { firstPath } = useModel('dynamic-route');

  return (
    <Result
      status="error"
      title="页面加载异常"
      subTitle="抱歉，您访问的页面加载异常, 请联系管理员!"
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

export default ErrorPage;
