import React from 'react';
import { Alert, Card, Typography } from 'antd';
import './index.less';

const CodePreview: React.FC = ({ children }) => (
  <pre className="pre">
    <code>
      <Typography.Text copyable>{children}</Typography.Text>
    </code>
  </pre>
);

export default (): React.ReactNode => {
  return (
    <Card>
      <Alert
        message="Ball Cat 欢迎页"
        type="success"
        showIcon
        banner
        style={{
          margin: -12,
          marginBottom: 24,
        }}
      />
      <CodePreview>可复制代码块</CodePreview>
    </Card>
  );
};
