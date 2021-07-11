import { createFromIconfontCN } from '@ant-design/icons';
import type React from 'react';
import settings from '../../../config/defaultSettings';

interface IconProps {
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  type: string;

  [key: string]: any;
}

export const Icon: React.FC<IconProps> = createFromIconfontCN({
  scriptUrl: settings.iconfontUrl,
});
