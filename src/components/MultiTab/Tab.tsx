import React from 'react';
import { Dropdown, Tabs } from 'antd';
import './index.less';
import { history } from 'umi';
import { useAliveController } from 'react-activation';
import RouteUtils from '@/utils/RouteUtils';
import { DownOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

type TabProps = {
  overlay: React.ReactElement;
  close: (...closeArray: string[]) => void;
};

const Tab = ({ overlay, close }: TabProps) => {
  const { getCachingNodes, dropScope } = useAliveController();

  const nodes = getCachingNodes();

  const cacheActiveKey = history.location.pathname;
  return (
    <Tabs
      hideAdd
      type="editable-card"
      activeKey={cacheActiveKey}
      tabBarExtraContent={
        <>
          <Dropdown
            className="ballcat-multi-tab-tool"
            overlay={overlay}
            trigger={['hover', 'contextMenu', 'click']}
          >
            <DownOutlined />
          </Dropdown>
        </>
      }
      onChange={(key) => {
        // 不是当前激活的tab
        if (cacheActiveKey !== key) {
          history.push(key);
        }
      }}
      onEdit={(key, action) => {
        if (action === 'remove' && typeof key === 'string') {
          close(key);
        }
      }}
    >
      {nodes.map((node) => {
        const nodeMenu = RouteUtils.getMenuDict()[node.name as string];

        // 移除不是当前展示的 404页面
        if (!nodeMenu && cacheActiveKey !== node.name && node.name) {
          dropScope(node.name);
        }

        return (
          <TabPane key={node.name} tabKey={node.id} tab={nodeMenu?.name || node.name || '404'} />
        );
      })}
    </Tabs>
  );
};

export default Tab;
