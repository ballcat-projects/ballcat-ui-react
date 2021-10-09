import { TreeSelect } from 'antd';
import { useState, useEffect } from 'react';
import { organization } from '@/services/ballcat/system';
import TreeUtils from '@/utils/TreeUtils';

type SelectOrganizationProps = {
  value?: number[];
  onChange?: (val: number[]) => void;
};

export default ({ value, onChange }: SelectOrganizationProps) => {
  const [treeData, setTreeData] = useState<any[]>([]);

  useEffect(() => {
    organization.query().then(({ data }) => {
      setTreeData(TreeUtils.toTreeSelectData(data as unknown as any[]) || []);
    });
  }, []);

  return (
    <TreeSelect
      multiple
      allowClear
      treeDefaultExpandAll
      placeholder="请选择组织"
      treeData={treeData}
      listHeight={800}
      filterTreeNode={(sv, node) => {
        return node?.label?.toString().indexOf(sv) !== -1;
      }}
      value={value}
      onChange={onChange}
    />
  );
};
