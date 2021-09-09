import { createFromIconfontCN } from '@ant-design/icons';
import React from 'react';
import { settings } from '@/utils/ConfigUtils';
import './Icon.less';

interface IconProps {
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  type: string;

  [key: string]: any;
}

// 引入图标
createFromIconfontCN({
  scriptUrl: settings.iconfontUrl,
});

const Icon: React.FC<IconProps> = (props: IconProps) => {
  const { style } = props;
  let { type } = props;
  if (!type || type.length === 0) {
    return <></>;
  }
  if (type && !type.startsWith(settings.iconPrefix)) {
    type = settings.iconPrefix + type;
  }

  const realStyle = { ...style };
  if (!realStyle.cursor) {
    realStyle.cursor = 'pointer';
  }

  const realProps = { ...props, type, style: realStyle };

  // 自定义图标渲染
  return (
    <i className="i-icon" {...realProps}>
      <svg
        style={{
          width: '1em',
          height: '1em',
          verticalAlign: '-0.15em',
          fill: 'currentColor',
          overflow: 'hidden',
        }}
      >
        <use xlinkHref={`#${type}`} />
      </svg>
    </i>
  );
};

export default Icon;
