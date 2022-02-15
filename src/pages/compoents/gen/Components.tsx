import { Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { Component } from '@lingting/code-generate-react';

export const AntdSelectComponent: Component = {
  icon: () => <PlusOutlined />,
  id: 'antd-select',
  name: 'antd 下拉选择',
  optionsRender: [
    {
      key: 'defaultValue',
      label: '默认值',
      placeholder: '请输入默认值',
    },
  ],
  render(options) {
    return <Select {...options} />;
  },
};
