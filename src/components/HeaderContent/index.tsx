import React from 'react';
import { Icon } from '@/components/Icon';

interface HeaderContentProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

const HeaderContent: React.FC<HeaderContentProps> = (props: HeaderContentProps) => {
  const { collapsed, onCollapse } = props;

  return (
    <div>
      <Icon
        style={{ fontSize: '18px' }}
        onClick={() => onCollapse(!collapsed)}
        type={collapsed ? 'ballcat-icon-indent' : 'ballcat-icon-outdent'}
      />
    </div>
  );
};

export default HeaderContent;
