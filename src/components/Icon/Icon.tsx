import { Spin } from 'antd';
import React from 'react';
import { allIcon } from '.';
import type { IconProps } from './typings';

const converTypeToIconPath = (type: string) => {
  let path = '';

  type.split('-').forEach((t) => {
    path = `${path}${t.substr(0, 1).toLocaleUpperCase()}${t.substring(1).toLocaleLowerCase()}`;
  });

  return `${path}Outlined`;
};

const Icon: React.FC<IconProps> = (props: IconProps) => {
  const { type } = props;
  const IconType = allIcon[converTypeToIconPath(type)];

  return IconType ? (
    <IconType {...props} />
  ) : (
    <Spin spinning size="small" style={{ marginRight: '2px' }} />
  );
};

export default Icon;
