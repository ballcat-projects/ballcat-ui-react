import Page from '@/components/Page';
import type { Document, DocumentQo, DocumentVo } from '@/services/ballcat/sample';
import { document } from '@/services/ballcat/sample';
import type { ProColumns } from '@ant-design/pro-table';
import { ProFormText } from '@ant-design/pro-form';
import Lov from '@/components/Lov';
import { Form } from 'antd';

const dataColumns: ProColumns<DocumentVo>[] = [
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: '文档名称',
    dataIndex: 'name',
    hideInSearch: true,
  },
  {
    title: '所属用户ID',
    dataIndex: 'userId',
    hideInSearch: true,
  },
  {
    title: '所属用户',
    dataIndex: 'username',
    hideInSearch: true,
  },
  {
    title: '所属组织ID',
    dataIndex: 'organizationId',
    hideInSearch: true,
  },
  {
    title: '所属组织',
    dataIndex: 'organizationName',
    hideInSearch: true,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: '150px',
    sorter: true,
    hideInSearch: true,
  },
];

export default () => {
  return (
    <Page.Modal<DocumentVo, DocumentQo, Document>
      {...document}
      rowKey="id"
      title="文档表，用于演示数据权限，可切换不同用户并授予不同角色体验效果(需退出重新登录)"
      columns={dataColumns}
      toolBarActions={[{ type: 'create', permission: false }]}
      operateBar={[{ type: 'del', permission: false }]}
    >
      <ProFormText hidden name="id" />

      <ProFormText
        label="文档名称"
        name="name"
        rules={[{ required: true, message: '请输入文档名称!' }]}
      />

      <Form.Item
        label="所属用户"
        name="userId"
        rules={[{ required: true, message: '请选择所属用户!' }]}
      >
        <Lov keyword="ballcat_user_multiple" overwriteConfig={{ multiple: false }} />
      </Form.Item>
    </Page.Modal>
  );
};
