import Page from '@/components/Page';
import type {
  SysMenuRoleGrateVo,
  SysRole,
  SysRoleBindQo,
  SysRoleBindVo,
  SysRoleQo,
  SysRoleVo,
} from '@/services/ballcat/system';
import { organization } from '@/services/ballcat/system';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { menu, role } from '@/services/ballcat/system';
import { ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { DictTag } from '@/components/Dict';
import Auth from '@/components/Auth';
import type { FormStatus } from '@/components/Form';
import { FormDictRadio } from '@/components/Form';
import { useState, useRef } from 'react';
import { message, Drawer, Tree, Spin, Button, Modal, TreeSelect, Popconfirm } from 'antd';
import type { TreeNode } from '@/typings';
import TreeUtils from '@/utils/TreeUtils';
import type { EventDataNode } from 'rc-tree/lib/interface';

const dataColumns: ProColumns<SysRoleVo>[] = [
  {
    title: '角色名称',
    dataIndex: 'name',
    sorter: true,
    width: 150,
    ellipsis: true,
  },
  {
    title: '角色标识',
    dataIndex: 'code',
    sorter: true,
    width: 180,
    copyable: true,
    ellipsis: true,
  },
  {
    title: '类型',
    dataIndex: 'type',
    sorter: true,
    width: 80,
    hideInSearch: true,
    render: (dom, record) => <DictTag code="role_type" value={record.type} />,
  },
  {
    title: '备注',
    dataIndex: 'remarks',
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
  const modalTableRef = useRef<ActionType>();

  const [status, setStatus] = useState<FormStatus>(undefined);
  const [grantData, setGrantData] = useState<SysRoleVo | undefined>(undefined);
  const [grantTreeData, setGrantTreeData] = useState<TreeNode<SysMenuRoleGrateVo>[]>([]);
  const [grantSelectedId, setGrantSelectedId] = useState<number[]>([]);
  const [grantLoading, setGrantLoading] = useState(false);
  const [bindData, setBindData] = useState<SysRoleVo | undefined>(undefined);
  const [bindTreeData, setBindTreeData] = useState<any[]>([]);

  const grantOpen = (data: SysRoleVo) => {
    setGrantLoading(true);
    setGrantData(data);

    // 获取可授权菜单
    menu.listRoleGrant().then((menuRes) => {
      const treeData = TreeUtils.ofList(
        menuRes.data as unknown as TreeNode<SysMenuRoleGrateVo>[],
        0,
        (item) => {
          return {
            ...item,
            key: item.id,
            checkable: true,
          };
        },
      );
      setGrantTreeData(treeData);
    });

    // 获取已授权菜单
    role
      .getPermissionIds(data.code)
      .then((roleRes) => {
        setGrantSelectedId(roleRes.data);
      })
      .finally(() => setGrantLoading(false));
  };

  const grantSelect = (checked: boolean, node: EventDataNode) => {
    setGrantLoading(true);
    const key = Number(node.key);
    const index = grantSelectedId.indexOf(key);

    if (checked && index === -1) {
      grantSelectedId.push(key);

      // @ts-ignore 父级未选中
      if (grantSelectedId.indexOf(node.parentId) === -1) {
        // 级联选中父级.
        const pos = node.pos.split('-');
        let posData: TreeNode<SysMenuRoleGrateVo>;
        pos.forEach((p, i) => {
          if (i === 0 || i === pos.length - 1) {
            return;
          }
          const pv = Number(p);
          if (posData === undefined) {
            posData = grantTreeData[pv];
          } else if (!posData.children) {
            return;
          } else {
            posData = posData.children[pv];
          }

          // 选中当前父级
          if (grantSelectedId.indexOf(posData.id) === -1) {
            grantSelectedId.push(posData.id);
          }
        });
      }

      // 选中子级.
      node.children?.forEach((c) => {
        grantSelect(checked, c as EventDataNode);
      });
    } else if (index !== -1) {
      grantSelectedId.splice(index, 1);

      // 取消选中子级
      node.children?.forEach((c) => {
        grantSelect(checked, c as EventDataNode);
      });
    }
    setGrantSelectedId([...grantSelectedId]);
    setGrantLoading(false);
  };

  const grantCancel = () => {
    setGrantData(undefined);
    setGrantSelectedId([]);
    setGrantTreeData([]);
  };

  const grantSave = () => {
    if (!grantData) {
      message.warning('数据异常!');
      return;
    }
    setGrantLoading(true);
    role
      .updatePermissionIds(grantData?.code, grantSelectedId)
      .then(() => {
        message.success('授权成功');
        grantCancel();
      })
      .finally(() => {
        setGrantLoading(false);
      });
  };

  const bindOpen = (data: SysRoleVo) => {
    setBindData(data);
    organization.query().then((res) => {
      const tree = TreeUtils.toTreeSelectData(res.data as unknown as any[]);
      setBindTreeData(tree || []);
    });
  };

  const bindCancel = () => {
    setBindData(undefined);
  };

  return (
    <>
      <Page.Modal<SysRoleVo, SysRoleQo, SysRole>
        {...role}
        title="角色管理"
        rowKey="id"
        columns={dataColumns}
        onStatusChange={setStatus}
        toolBarActions={[{ type: 'create', permission: 'system:role:add' }]}
        operteBarProps={{ width: 200 }}
        operateBar={[
          { type: 'edit', permission: 'system:role:edit' },
          (dom, record) => (
            <Auth.A
              key={`sys-role-gr1-${record.id}`}
              permission="system:role:grant"
              text="授权"
              onClick={() => grantOpen(record)}
            />
          ),
          (dom, record) => (
            <Auth.A
              key={`sys-role-gr2-${record.id}`}
              permission="system:role:grant"
              text="绑定"
              onClick={() => bindOpen(record)}
            />
          ),
          { type: 'del', permission: 'system:role:del' },
        ]}
        formProps={{ titleSuffix: '角色' }}
      >
        <ProFormText name="id" hidden />
        <ProFormText
          name="name"
          label="角色名称"
          rules={[{ required: true, message: '角色名称不能为空!' }]}
        />

        <ProFormText
          name="code"
          label="角色标识"
          disabled={status === 'edit'}
          placeholder="必须以ROLE_开头!"
          rules={[
            { required: true, message: '角色标识不能为空!' },
            {
              validator: (_rule, val) => {
                if (val && !val.startsWith('ROLE_')) {
                  const msg = '必须以ROLE_开头!';
                  return Promise.reject(msg);
                }

                return Promise.resolve();
              },
            },
          ]}
        />

        <FormDictRadio
          name="type"
          label="角色类型"
          code="role_type"
          dictProps={{ radioType: 'button', disabled: status === 'edit' }}
          initialValue={1}
        />

        <ProFormTextArea name="remarks" label="备注" />
      </Page.Modal>

      <Drawer
        width="590px"
        title={`${grantData?.code} 授权`}
        visible={grantData !== undefined}
        footerStyle={{ textAlign: 'right' }}
        footer={
          <>
            <Button style={{ marginRight: 10 }} onClick={() => grantCancel()}>
              取消
            </Button>
            <Button type="primary" onClick={() => grantSave()}>
              保存
            </Button>
          </>
        }
        onClose={() => grantCancel()}
      >
        <Spin spinning={grantLoading || grantTreeData.length === 0} size="large">
          <Tree
            checkable
            checkStrictly
            autoExpandParent
            treeData={grantTreeData}
            checkedKeys={grantSelectedId}
            onCheck={(_checked, { checked, node }) => {
              grantSelect(checked, node);
            }}
          />
        </Spin>
      </Drawer>

      <Modal
        destroyOnClose
        width={800}
        title={`${bindData?.code} 角色用户绑定`}
        visible={bindData !== undefined}
        footer={false}
        bodyStyle={{ padding: 0 }}
        onCancel={() => bindCancel()}
      >
        <Page.Modal<SysRoleBindVo, SysRoleBindQo, any>
          rowKey="userId"
          query={role.listRoleBindUser}
          tableRef={modalTableRef}
          columns={[
            {
              title: '用户ID',
              dataIndex: 'userId',
              width: '60px',
              align: 'center',
            },
            {
              title: '用户名',
              dataIndex: 'username',
              width: '120px',
              ellipsis: true,
            },
            {
              title: '昵称',
              dataIndex: 'nickname',
              hideInSearch: true,
              ellipsis: true,
            },
            {
              title: '组织机构',
              dataIndex: 'organizationName',
              width: '120px',
              ellipsis: true,
              hideInSearch: true,
            },
            {
              title: '组织',
              dataIndex: 'organizationId',
              hideInTable: true,
              renderFormItem: () => {
                return <TreeSelect treeData={bindTreeData} />;
              },
            },
          ]}
          operateBar={[
            (dom, record) => {
              return (
                <Popconfirm
                  title="确认要解绑吗？"
                  onConfirm={() =>
                    role
                      // @ts-ignore
                      .unbindUser(record.userId, bindData?.code)
                      .then(() => modalTableRef.current?.reload())
                  }
                >
                  <a style={{ color: 'red' }}>解绑</a>
                </Popconfirm>
              );
            },
          ]}
          tableProps={{
            // @ts-ignore
            params: { roleCode: bindData?.code },
            options: false,
          }}
        />
      </Modal>
    </>
  );
};
