import React from 'react';
import { Breadcrumb } from 'antd';
import I18n from '@/utils/I18nUtils';
import {
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ReloadOutlined,
} from '@ant-design/icons';

interface HeaderContentProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
  onReload: (reload: boolean) => void;
  breadcrumbData: { path: string; name: string }[];
}

const iconStyle = {
  cursor: 'pointer',
  fontSize: '16px',
  marginRight: '5px',
};

const HeaderContent: React.FC<HeaderContentProps> = (props: HeaderContentProps) => {
  const { collapsed, onCollapse, onReload, breadcrumbData } = props;
  const CollapsedIcon = collapsed ? MenuUnfoldOutlined : MenuFoldOutlined;

  return (
    <div>
      <CollapsedIcon
        title={I18n.text('component.global.header.content.fold')}
        style={iconStyle}
        onClick={() => onCollapse(!collapsed)}
      />
      <ReloadOutlined
        title={I18n.text('component.global.header.content.reload')}
        style={iconStyle}
        onClick={() => {
          onReload(true);
          window.location.reload();
        }}
      />

      <Breadcrumb style={{ width: 'calc(100% - 64px)', display: 'inline-block' }}>
        <Breadcrumb.Item>
          <HomeOutlined style={{ ...iconStyle, marginRight: 0 }} />
        </Breadcrumb.Item>
        {breadcrumbData}
      </Breadcrumb>
    </div>
  );
};

export default HeaderContent;
