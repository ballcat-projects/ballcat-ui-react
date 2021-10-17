import React, { useCallback } from 'react';
import { Tabs, Menu, Dropdown } from 'antd';
import './index.less';
import I18n from '@/utils/I18nUtils';
import { history, useModel } from 'umi';
import { useAliveController } from 'react-activation';
import RouteUtils from '@/utils/RouteUtils';

const { TabPane } = Tabs;

const MultiTab = () => {
  const { getCachingNodes, dropScope } = useAliveController();

  const { initialState } = useModel('@@initialState');

  const nodes = getCachingNodes();

  const cacheActiveKey = history.location.pathname;

  // 关闭指定 key
  const close = useCallback(
    (...closeArray: string[]) => {
      if (!closeArray || closeArray.length === 0) {
        I18n.warning('没有可以被关闭的标签页!');
        return;
      }
      if (nodes.length === 1) {
        I18n.warning('禁止关闭最后一个标签页!');
        return;
      }

      // 是否需要跳转地址
      let isRedirect = false;
      // const surviveNode: CachingNode[] = []
      const surviveNode: string[] = [];

      for (let index = 0; index < nodes.length; index += 1) {
        const nodeKey = nodes[index].name as string;

        // 该节点不需要销毁
        if (closeArray.indexOf(nodeKey) === -1) {
          surviveNode.push(nodeKey);
        }
        // 销毁节点为当前展示节点
        else if (nodeKey === cacheActiveKey) {
          isRedirect = true;
        }
      }

      // 需要跳转且存活节点数量大于0
      if (isRedirect) {
        // 跳转到存活节点的第一个
        RouteUtils.goto(surviveNode.length > 0 ? surviveNode[0] : '/');
      }

      // 依次销毁
      closeArray.forEach((closeKey) => {
        dropScope(closeKey);
      });
    },
    [cacheActiveKey, dropScope, nodes],
  );

  // 关闭指定key 左侧的所有key
  const closeLeft = useCallback(
    (key: string) => {
      const closeKeys: string[] = [];

      for (let index = 0; index < nodes.length; index += 1) {
        const nodeKey = nodes[index].name as string;
        if (nodeKey === key) {
          break;
        }

        closeKeys.push(nodeKey);
      }
      close(...closeKeys);
    },
    [close, nodes],
  );

  // 关闭指定key 右侧的所有key
  const closeRight = useCallback(
    (key: string) => {
      const closeKeys: string[] = [];

      for (let index = nodes.length - 1; index > -1; index -= 1) {
        const nodeKey = nodes[index].name as string;
        if (nodeKey === key) {
          break;
        }

        closeKeys.push(nodeKey);
      }
      close(...closeKeys);
    },
    [close, nodes],
  );

  // 关闭指定key 除外的其他key
  const closeOther = useCallback(
    (key: string) => {
      const closeKeys: string[] = [];

      nodes.forEach(({ name }) => {
        if (name !== key) {
          closeKeys.push(name as string);
        }
      });

      close(...closeKeys);
    },
    [close, nodes],
  );

  const overlay = (
    <Menu key="MultiTabDropdown" onContextMenu={(e) => e.preventDefault()}>
      <Menu.Item key="MultiTabDropdown-close" onClick={() => close(cacheActiveKey)}>
        关闭标签
      </Menu.Item>
      <Menu.Item key="MultiTabDropdown-close-left" onClick={() => closeLeft(cacheActiveKey)}>
        关闭左侧标签
      </Menu.Item>
      <Menu.Item key="MultiTabDropdown-close-right" onClick={() => closeRight(cacheActiveKey)}>
        关闭右侧标签
      </Menu.Item>
      <Menu.Item key="MultiTabDropdown-close-other" onClick={() => closeOther(cacheActiveKey)}>
        关闭其他标签
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={overlay} trigger={['contextMenu']}>
      <div
        className="ballcat-multi-tab"
        style={{
          userSelect: 'none',
          marginLeft: initialState?.settings?.layout === 'mix' ? '208px' : undefined,
        }}
      >
        <Tabs
          hideAdd
          type="editable-card"
          activeKey={cacheActiveKey}
          onChange={(key) => {
            // 不是当前激活的tab
            if (cacheActiveKey !== key) {
              RouteUtils.goto(key);
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
            return <TabPane key={node.name} tabKey={node.id} tab={nodeMenu.name} />;
          })}
        </Tabs>
      </div>
    </Dropdown>
  );
};

export default MultiTab;
