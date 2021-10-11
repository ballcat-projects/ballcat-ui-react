import type { FormGroupProps } from '.';
import React from 'react';
import { Col, Row } from 'antd';

const handlerNode = (node: JSX.Element) => {
  let dom = node;
  const { props } = node;

  // 仅在 labelCol wrapperCol 均不存在时渲染
  if (!props.labelCol && !props.wrapperCol) {
    dom = React.cloneElement(node, {
      ...props,
      labelCol: { sm: { span: 24 }, md: { span: 8 } },
    });
  }

  return (
    <Col key={`form-col-${props.name}-${props.label}`} xs={24} sm={24} md={12}>
      {dom}
    </Col>
  );
};

const FormGroup = ({ children }: FormGroupProps) => {
  const nodes: JSX.Element[] = [];

  if (children instanceof Array) {
    children.forEach((c) => {
      nodes.push(handlerNode(c));
    });
  } else if (children) {
    nodes.push(handlerNode(children));
  }

  return <Row gutter={16}>{nodes}</Row>;
};

export default FormGroup;
