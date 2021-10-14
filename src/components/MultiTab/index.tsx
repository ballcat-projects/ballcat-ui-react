import React, { useEffect, useState, useCallback, useImperativeHandle } from 'react';
import { Tabs, Menu, Dropdown } from 'antd';
import './index.less';
import I18n from '@/utils/I18nUtils';
import { useModel } from 'umi';

import type { MultiTabProps } from './typings';

export * from './typings';

const { TabPane } = Tabs;

const MultiTab = ({ multiTabRef }: MultiTabProps) => {
  const { initialState } = useModel('@@initialState');

  const [keys, setKeys] = useState<string[]>([]);
  const [panes, setPanes] = useState<React.ReactNode[]>([]);
  const [activeKey, setActiveKey] = useState<string>('');
  const [cache, setCache] = useState<Record<string, any>>({});
  const update = useCallback(
    (key: string, dom: any) => {
      const newCache = { ...cache };
      newCache[key] = dom;
      setCache(newCache);
    },
    [cache],
  );

  const active = useCallback(
    (key: string, dom?: any) => {
      if (dom) {
        update(key, dom);
      }
      setActiveKey(key);
    },
    [update],
  );

  useImperativeHandle(multiTabRef, () => ({
    switch: (key, dom) => {
      active(key, dom);
    },
    update,
    get: (key) => cache[key],
  }));

  // 关闭指定 key
  const close = useCallback(
    (...closeArray: string[]) => {
      if (!closeArray || closeArray.length === 0) {
        I18n.warning('没有可以被关闭的标签页!');
        return;
      }

      if (keys.length === 1) {
        I18n.warning('禁止关闭最后一个标签页!');
        return;
      }

      let switctKey = false;
      const newKeys: string[] = [];
      keys.forEach((key) => {
        if (closeArray.indexOf(key) === -1) {
          // 未删除
          newKeys.push(key);
          return;
        }
        // 删除当前展示key
        if (key === activeKey) {
          switctKey = true;
        }

        // 指定缓存的清理
      });

      setKeys(newKeys);
      if (switctKey) {
        active(newKeys[0]);
      }
    },
    [active, activeKey, keys],
  );

  // 关闭指定key 左侧的所有key
  const closeLeft = useCallback(
    (key: string) => {
      const max = keys.indexOf(key);
      const delKeys: string[] = [];
      for (let index = 0; index < max; index += 1) {
        delKeys.push(keys[index]);
      }
      close(...delKeys);
    },
    [close, keys],
  );

  // 关闭指定key 右侧的所有key
  const closeRight = useCallback(
    (key: string) => {
      const min = keys.indexOf(key);
      const delKeys: string[] = [];
      for (let index = min + 1; index < keys.length; index += 1) {
        delKeys.push(keys[index]);
      }
      close(...delKeys);
    },
    [close, keys],
  );

  // 关闭指定key 除外的其他key
  const closeOther = useCallback(
    (key: string) => {
      const delKeys: string[] = [];

      keys.forEach((otherKey) => {
        if (otherKey !== key) {
          delKeys.push(otherKey);
        }
      });

      close(...delKeys);
    },
    [close, keys],
  );

  const overlay = (
    <Menu key="MultiTabDropdown" onContextMenu={(e) => e.preventDefault()}>
      <Menu.Item key="MultiTabDropdown-close" onClick={() => close(activeKey)}>
        关闭标签
      </Menu.Item>
      <Menu.Item key="MultiTabDropdown-close-left" onClick={() => closeLeft(activeKey)}>
        关闭左侧标签
      </Menu.Item>
      <Menu.Item key="MultiTabDropdown-close-right" onClick={() => closeRight(activeKey)}>
        关闭右侧标签
      </Menu.Item>
      <Menu.Item key="MultiTabDropdown-close-other" onClick={() => closeOther(activeKey)}>
        关闭其他标签
      </Menu.Item>
    </Menu>
  );

  useEffect(() => {
    const nodes: React.ReactNode[] = [];

    keys.forEach((key) => {
      nodes.push(<TabPane key={key} tabKey={`tab-${key}`} tab={key} />);
    });

    setPanes(nodes);
  }, [keys]);

  return (
    <Dropdown overlay={overlay} trigger={['contextMenu']}>
      <div
        className="ballcat-multi-tab"
        style={{ marginLeft: initialState?.settings?.layout === 'mix' ? '208px' : undefined }}
      >
        <Tabs
          hideAdd
          type="editable-card"
          activeKey={activeKey}
          onChange={active}
          onEdit={(key, action) => {
            if (action === 'remove') {
              close(key as string);
            }
          }}
        >
          {panes}
        </Tabs>
      </div>
    </Dropdown>
  );
};

export default MultiTab;
