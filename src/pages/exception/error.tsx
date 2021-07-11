import { Button, Result } from 'antd';
import React from 'react';
import { history } from 'umi';

const Error: React.FC = () => (
  <Result
    status="error"
    title="页面配置异常"
    subTitle="抱歉，您访问的页面配置异常, 请联系管理员!"
    extra={
      <Button
        type="primary"
        onClick={() => {
          history.push('/');
        }}
      >
        返回首页
      </Button>
    }
  />
);

export default Error;
