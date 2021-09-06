import React from 'react';
import { Icon } from '@/components/Icon';
import { Breadcrumb } from 'antd';
import I18n from '@/utils/I18nUtils';

interface HeaderContentProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
  onReload: (reload: boolean) => void;
  breadcrumbData: { path: string; name: string }[];
}

const iconStyle = {
  cursor: 'pointer',
  fontSize: '18px',
  height: '18px',
  width: '18px',
  marginRight: '5px',
};

const HeaderContent: React.FC<HeaderContentProps> = (props: HeaderContentProps) => {
  const { collapsed, onCollapse, onReload, breadcrumbData } = props;

  return (
    <div>
      <Icon
        title={I18n.text('component.global.header.content.fold')}
        style={iconStyle}
        onClick={() => onCollapse(!collapsed)}
        type={collapsed ? 'ballcat-icon-indent' : 'ballcat-icon-outdent'}
      />
      <Icon
        title={I18n.text('component.global.header.content.reload')}
        style={iconStyle}
        onClick={() => {
          onReload(true);
          window.location.reload();
        }}
        type={'ballcat-icon-reload'}
      />

      <Breadcrumb style={{ width: 'calc(100% - 64px)', display: 'inline-block' }}>
        <Breadcrumb.Item>
          {' '}
          <Icon style={{ ...iconStyle, marginRight: 0 }} type={'ballcat-icon-home'} />
        </Breadcrumb.Item>
        {breadcrumbData}
      </Breadcrumb>
    </div>
  );
};

export default HeaderContent;
