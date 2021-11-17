import React, { useCallback } from 'react';
import { Menu, Dropdown } from 'antd';
import './index.less';
import I18n from '@/utils/I18nUtils';
import { history, useModel } from 'umi';
import { useAliveController } from 'react-activation';
import RouteUtils from '@/utils/RouteUtils';
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CloseCircleOutlined,
  CloseOutlined,
  CompressOutlined,
  ExpandOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import type { RouteContextType } from '@ant-design/pro-layout';
import { RouteContext } from '@ant-design/pro-layout';
import Tab from './Tab';

const MultiTab = () => {
  const { getCachingNodes, dropScope, refreshScope } = useAliveController();

  const { initialState } = useModel('@@initialState');

  const { fixedHeader, multiTabStyle } = initialState?.settings || {};

  const { isContentFull, contentFull, contentExit } = useModel('full-screen');

  const nodes = getCachingNodes();

  const cacheActiveKey = history.location.pathname;

  // 关闭指定 key
  const close = useCallback(
    (...closeArray: string[]) => {
      if (!closeArray || closeArray.length === 0) {
        I18n.warning('multiTab.close.no');
        return;
      }
      if (nodes.length === 1) {
        I18n.warning('multiTab.close.disable');
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
    <Menu
      className="none-user-select"
      key="MultiTabDropdown"
      onContextMenu={(e) => e.preventDefault()}
    >
      <Menu.Item
        key="MultiTabDropdown-full"
        onClick={() => (isContentFull ? contentExit() : contentFull())}
      >
        {isContentFull ? <CompressOutlined /> : <ExpandOutlined />}{' '}
        {I18n.text(isContentFull ? 'multiTab.full.exit' : 'multiTab.full')}
      </Menu.Item>
      <Menu.Item key="MultiTabDropdown-refresh" onClick={() => refreshScope(cacheActiveKey)}>
        <ReloadOutlined /> {I18n.text('multiTab.refresh')}
      </Menu.Item>
      <Menu.Item key="MultiTabDropdown-close" onClick={() => close(cacheActiveKey)}>
        <CloseOutlined /> {I18n.text('multiTab.close')}
      </Menu.Item>
      <Menu.Item key="MultiTabDropdown-close-left" onClick={() => closeLeft(cacheActiveKey)}>
        <ArrowLeftOutlined /> {I18n.text('multiTab.close.left')}
      </Menu.Item>
      <Menu.Item key="MultiTabDropdown-close-right" onClick={() => closeRight(cacheActiveKey)}>
        <ArrowRightOutlined /> {I18n.text('multiTab.close.right')}
      </Menu.Item>
      <Menu.Item key="MultiTabDropdown-close-other" onClick={() => closeOther(cacheActiveKey)}>
        <CloseCircleOutlined /> {I18n.text('multiTab.close.other')}
      </Menu.Item>
    </Menu>
  );

  const classNames = ['ballcat-multi-tab'];
  if (multiTabStyle === 'card') {
    classNames.push('ballcat-multi-tab-card');
  }

  classNames.push(`ballcat-multi-tab-${fixedHeader ? 'fixed' : 'float'}`);

  return (
    <RouteContext.Consumer>
      {({ siderWidth }: RouteContextType) => {
        return (
          <Dropdown overlay={overlay} trigger={['contextMenu']}>
            <div
              className={classNames.join(' ')}
              style={{
                width: !fixedHeader
                  ? undefined
                  : `calc(100% - ${(siderWidth || 0) + (multiTabStyle === 'card' ? 48 : 0)}px)`,
                top: isContentFull ? `${fixedHeader ? 0 : -24}px` : undefined,
              }}
            >
              <Tab overlay={overlay} close={close} />
            </div>
          </Dropdown>
        );
      }}
    </RouteContext.Consumer>
  );
};

export default MultiTab;
