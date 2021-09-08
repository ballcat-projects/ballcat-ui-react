import { Form } from 'antd';
import type { LtFormItemProps } from './typings';
import Icon from '../Icon';
import React from 'react';

function LtFormItem<V = any>(props: LtFormItemProps<V> & { children: JSX.Element }) {
  const { name, label, initialValue, formItemProps, children } = props;
  let { tooltip } = props;

  // 不是自定义的节点. 是 string
  if (tooltip && !React.isValidElement(tooltip) && typeof tooltip.icon === 'string') {
    // @ts-ignore
    tooltip = { ...tooltip, icon: <Icon type={tooltip.icon} /> };
  }

  return (
    <Form.Item<V>
      {...formItemProps}
      name={name}
      label={label}
      initialValue={initialValue}
      tooltip={tooltip}
    >
      {children}
    </Form.Item>
  );
}

export default LtFormItem;
