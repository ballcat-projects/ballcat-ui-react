import { Tree, Input, Card } from 'antd';
import { useState, useEffect } from 'react';
import type { Key } from 'rc-tree/lib/interface';
import { RedoOutlined } from '@ant-design/icons';

type OrganizationTreeProps = {
  treeData: any[];
  reload: () => void;
  value: number[];
  onChange: (value: number[]) => void;
};

const searchTree = (
  td: any[],
  sv?: string,
): {
  keys: Key[];
  treeData: any[];
} => {
  if (!sv || sv.length === 0) {
    return { keys: [], treeData: td };
  }

  const keys: Key[] = [];
  const treeData: any[] = [];

  td.forEach((item) => {
    const { title, key, children } = item;
    const ni = { ...item };
    const index = title.indexOf(sv);

    // 搜索当前节点
    if (index > -1) {
      const befor = title.substr(0, index);
      const after = title.substr(index + sv.length);

      ni.title = (
        <span>
          {befor} <span style={{ color: '#f50' }}>{sv}</span> {after}
        </span>
      );

      keys.push(key);
    }

    // 搜索子节点
    if (children) {
      const cst = searchTree(children, sv);
      if (cst.keys.length > 0) {
        if (keys.indexOf(key) === -1) {
          keys.push(key);
        }
        keys.push(...cst.keys);
        ni.children = cst.treeData;
      }
    }

    treeData.push(ni);
  });

  return {
    keys,
    treeData,
  };
};

export default ({ value, onChange, treeData, reload }: OrganizationTreeProps) => {
  const [searchTreeData, setSearchTreeData] = useState<any[]>([]);

  const [searchVal, setSearchVal] = useState<string>();
  const [expandedKeys, setExpandedKeys] = useState<any[]>([]);

  useEffect(() => {
    const st = searchTree(treeData, searchVal);
    setSearchTreeData(st.treeData);
    setExpandedKeys(st.keys);
  }, [treeData, searchVal]);

  return (
    <Card loading={treeData.length === 0}>
      <Input
        allowClear
        placeholder="输入内容以搜索组织"
        style={{ marginBottom: 5 }}
        addonAfter={
          <RedoOutlined title="刷新数据" style={{ fontSize: 18 }} onClick={() => reload()} />
        }
        onChange={(e) => {
          setSearchVal(e.target.value);
        }}
      />
      <Tree
        multiple
        blockNode
        treeData={searchTreeData}
        selectedKeys={value}
        expandedKeys={expandedKeys}
        onExpand={setExpandedKeys}
        onSelect={(keys) => onChange(keys as number[])}
      />
    </Card>
  );
};
