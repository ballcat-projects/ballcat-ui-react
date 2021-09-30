import LtPage from '@/components/LtPage';
import type {
  SysOrganizationDto,
  SysOrganizationQo,
  SysOrganizationVo,
} from '@/services/ballcat/system';
import { useState, useRef } from 'react';
import { organization } from '@/services/ballcat/system';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import Auth from '@/components/Auth';
import { ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { message, Form, TreeSelect } from 'antd';
import { LtFormNumber } from '@/components/LtForm';
import TreeUtils from '@/utils/TreeUtils';

const dataColumns: ProColumns<SysOrganizationVo>[] = [
  { title: '组织名称', dataIndex: 'name', hideInTable: true },
  {
    title: '组织机构层级',
    width: 250,
    dataIndex: 'name',
    hideInSearch: true,
  },
  {
    title: '排序',
    width: 80,
    dataIndex: 'sort',
    hideInSearch: true,
  },
  {
    title: '描述信息',
    dataIndex: 'description',
    ellipsis: true,
    hideInSearch: true,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 150,
    hideInSearch: true,
  },
];

export default () => {
  const tableRef = useRef<ActionType>();
  const [treeSelectData, setTreeSelectData] = useState<any[]>([
    { value: 0, label: '根目录', children: [] },
  ]);
  return (
    <LtPage.Modal<SysOrganizationVo, SysOrganizationQo, SysOrganizationDto>
      {...organization}
      title="组织架构"
      rowKey="id"
      columns={dataColumns}
      tableRef={tableRef}
      toolBarActions={[
        <Auth.Button
          permission="system:organization:revised"
          text="校正层级深度"
          type="primary"
          icon="Interaction"
          danger
          confirm={{ title: '确认进行校正操作?', overlayStyle: { width: '200px' } }}
          onClick={() => {
            organization.revised().then(() => {
              message.success('校正完成!');
              tableRef.current?.reload();
            });
          }}
        />,
        { type: 'create', permission: 'system:organization:add' },
      ]}
      operateBar={[
        {
          type: 'edit',
          permission: 'system:organization:edit',
        },
        {
          type: 'del',
          permission: 'system:organization:del',
        },
      ]}
      tableProps={{
        pagination: false,
        postData: (data) => {
          treeSelectData[0].children = TreeUtils.toTreeSelectData(data);
          setTreeSelectData(treeSelectData);
          return treeSelectData[0].children;
        },
      }}
      modalProps={{ titleSuffix: '组织' }}
    >
      <ProFormText name="id" hidden />

      <Form.Item
        label="父级组织"
        name="parentId"
        initialValue={0}
        rules={[{ required: true, message: '请选择父级组织' }]}
      >
        <TreeSelect
          treeDefaultExpandAll
          treeData={treeSelectData}
          dropdownStyle={{ maxHeight: '400px', overflow: 'auto' }}
        />
      </Form.Item>

      <ProFormText
        name="name"
        label="组织名称"
        rules={[{ required: true, message: '请填写组织名称' }]}
      />

      <LtFormNumber
        min={0}
        initialValue={1}
        name="sort"
        label="排序"
        placeholder="按数值由小到大升序"
      />

      <ProFormTextArea
        name="description"
        label="描述信息"
        rules={[{ max: 512, message: '描述信息最多可以填写512个字符!' }]}
      />
    </LtPage.Modal>
  );
};
