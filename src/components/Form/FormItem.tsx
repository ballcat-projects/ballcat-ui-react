import { Form } from 'antd';
import type { FormItemProps } from './typings';
import Icon from '../Icon';
import React from 'react';

function FormItem<V = any>(props: FormItemProps<V> & { children: JSX.Element }) {
  const { children } = props;
  let { tooltip } = props;

  // 不是自定义的节点. 是 string
  if (
    tooltip &&
    typeof tooltip === 'object' &&
    !React.isValidElement(tooltip) &&
    // @ts-ignore
    typeof tooltip.icon === 'string'
  ) {
    // @ts-ignore
    tooltip = { ...tooltip, icon: <Icon type={tooltip.icon} /> };
  }

  const formItemProps = { ...props, tooltip };

  return <Form.Item<V> {...formItemProps}>{children}</Form.Item>;
}

export default FormItem;
