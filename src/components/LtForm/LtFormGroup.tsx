import type { LtFormGroupProps } from '.';
import React from 'react';
import { Col, Row } from 'antd';

const handlerNode = (node: JSX.Element) => {
  let dom = node;

  // 仅在 labelCol wrapperCol 均不存在时渲染
  if (!node.props.labelCol && !node.props.wrapperCol) {
    dom = React.cloneElement(node, {
      ...node.props,
      labelCol: { sm: { span: 24 }, md: { span: 8 } },
    });
  }

  return (
    <Col xs={24} sm={24} md={12}>
      {dom}
    </Col>
  );
};

const LtFormGroup = ({ children }: LtFormGroupProps) => {
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

export default LtFormGroup;
