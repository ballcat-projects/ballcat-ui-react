import type { FormStatus } from '@/components/Form';
import Page from '@/components/Page';
import type { SysConfig, SysConfigQo, SysConfigVo } from '@/services/ballcat/system';
import { config } from '@/services/ballcat/system';
import { ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import type { ProColumns } from '@ant-design/pro-table';
import { useState } from 'react';

const dataColumns: ProColumns<SysConfigVo>[] = [
  {
    title: '配置名称',
    dataIndex: 'name',
    width: 100,
    ellipsis: true,
  },
  {
    title: 'Key',
    dataIndex: 'confKey',
    width: 100,
    ellipsis: true,
    copyable: true,
  },
  {
    title: 'Value',
    dataIndex: 'confValue',
    width: 100,
    ellipsis: true,
    hideInSearch: true,
  },
  {
    title: '分类',
    dataIndex: 'category',
    width: 100,
  },
  {
    title: '备注信息',
    dataIndex: 'description',
    ellipsis: true,
    hideInSearch: true,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 150,
    sorter: true,
    hideInSearch: true,
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    width: 150,
    sorter: true,
    hideInSearch: true,
  },
];

export default () => {
  const [status, setStatus] = useState<FormStatus>(undefined);

  return (
    <Page.Modal<SysConfigVo, SysConfigQo, SysConfig>
      {...config}
      title="配置信息"
      rowKey="id"
      columns={dataColumns}
      toolBarActions={[{ type: 'create', permission: 'system:config:edit' }]}
      operateBar={[
        { type: 'edit', permission: 'system:config:edit' },
        { type: 'del', permission: 'system:config:del' },
      ]}
      formProps={{ titleSuffix: '配置' }}
      onStatusChange={setStatus}
    >
      <ProFormText hidden name="id" />

      <ProFormText
        name="name"
        label="名称"
        rules={[{ required: true, message: '请输入配置名称!' }]}
      />
      <ProFormText
        name="confKey"
        label="Key"
        disabled={status === 'edit'}
        rules={[{ required: true, message: '请输入 Key!' }]}
      />
      <ProFormText
        name="confValue"
        label="Value"
        rules={[{ required: true, message: '请输入 Value!' }]}
      />
      <ProFormText name="category" label="分类" />
      <ProFormTextArea name="description" label="备注" />
    </Page.Modal>
  );
};
