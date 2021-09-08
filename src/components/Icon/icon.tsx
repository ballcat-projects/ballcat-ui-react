import { createFromIconfontCN } from '@ant-design/icons';
import React from 'react';
import { settings } from '@/utils/ConfigUtils';

interface IconProps {
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  type: string;

  [key: string]: any;
}

const IconNode: React.FC<IconProps> = createFromIconfontCN({
  scriptUrl: settings.iconfontUrl,
});

const Icon: React.FC<IconProps> = (props: IconProps) => {
  let { type } = props;
  if (type && !type.startsWith(settings.iconPrefix)) {
    type = settings.iconPrefix + type;
  }

  return <IconNode {...{ ...props, type }} />;
};

export default Icon;
