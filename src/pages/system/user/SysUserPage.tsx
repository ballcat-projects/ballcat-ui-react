import type { SysUserDto, SysUserQo, SysUserVo } from '@/services/ballcat/system';
import { organization } from '@/services/ballcat/system';
import {
  message,
  Col,
  Row,
  Avatar,
  TreeSelect,
  Form,
  Dropdown,
  Menu,
  Popconfirm,
  Button,
} from 'antd';
import { useState, useRef, useEffect, useCallback } from 'react';
import type { Key } from 'rc-tree/lib/interface';
import { user } from '@/services/ballcat/system';
import Page from '@/components/Page';
import { ProFormText } from '@ant-design/pro-form';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import UrlUtils from '@/utils/UrlUtils';
import { DictBadge, DictSelect, DictTag } from '@/components/Dict';
import type { FormStatus, ModalFormRef } from '@/components/Form';
import { FormDictRadio } from '@/components/Form';
import { pwd } from '@/utils/Encrypt';
import SelectRole from './SelectRole';
import Auth from '@/components/Auth';
import Grant from './Grant';
import Pass from './Pass';
import Cropper from '@/components/Cropper';
import {
  DeleteOutlined,
  DownOutlined,
  InfoOutlined,
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import OrganizationTree from './OrganizationTree';
import TreeUtils from '@/utils/TreeUtils';

export default () => {
  const tableRef = useRef<ActionType>();
  const formRef = useRef<ModalFormRef<SysUserDto>>();

  const [treeData, setTreeData] = useState<any[]>([]);
  const [oIds, setOIds] = useState<number[]>([]);

  const [status, setStatus] = useState<FormStatus>(undefined);
  const [grateVisible, setgrateVisible] = useState(false);
  const [grateRecord, setGrateRecord] = useState<SysUserVo>();

  const [passVisible, setPassVisible] = useState(false);
  const [passRecord, setPassRecord] = useState<SysUserVo>();

  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  const [avatarData, setAvatarData] = useState<SysUserVo>();

  const dataColumns: ProColumns<SysUserVo>[] = [
    {
      title: '用户名',
      dataIndex: 'username',
      align: 'center',
      order: 2,
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      align: 'center',
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      align: 'center',
      hideInSearch: true,
      render: (dom, record) => {
        return (
          <span onClick={() => setAvatarData(record)}>
            <Avatar
              alt="avatar"
              shape="square"
              size="large"
              style={{ cursor: 'pointer' }}
              icon={<UserOutlined />}
              src={UrlUtils.resolveImage(record.avatar)}
            />
          </span>
        );
      },
    },
    {
      title: '性别',
      dataIndex: 'sex',
      align: 'center',
      hideInSearch: true,
      render: (dom, record) => {
        return <DictTag code="gender" value={record.sex} />;
      },
    },
    {
      title: '组织',
      dataIndex: 'organizationName',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '电话',
      dataIndex: 'phone',
      align: 'center',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      align: 'center',
      hideInTable: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      width: '80px',
      order: 1,
      render: (dom, record) => <DictBadge code="user_status" value={record.status} />,
      renderFormItem: () => <DictSelect allowClear code="user_status" />,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
      hideInSearch: true,
      width: '150px',
      sorter: true,
    },
  ];

  const loadTreeData = useCallback(() => {
    setTreeData([]);
    organization.query().then((res) => {
      const tree = TreeUtils.toTreeData((res.data as unknown) as any[], (item) => {
        return { ...item, label: item.name, value: item.id };
      });
      setTreeData(tree || []);
    });
  }, []);

  useEffect(() => {
    loadTreeData();
  }, [loadTreeData]);

  return (
    <>
      <Row gutter={14}>
        <Col md={5}>
          <OrganizationTree
            treeData={treeData}
            reload={() => loadTreeData()}
            value={oIds}
            onChange={setOIds}
          />
        </Col>
        <Col md={19}>
          <Page.Modal<SysUserVo, SysUserQo, SysUserDto>
            {...user}
            title="系统用户"
            rowKey="userId"
            columns={dataColumns}
            tableRef={tableRef}
            formRef={formRef}
            handlerData={(body, st) => {
              if (st === 'create') {
                return { ...body, pass: pwd.encrypt(body.pass) };
              }
              return body;
            }}
            operateBar={[
              (dom, record) => {
                return (
                  <Dropdown
                    key={`user-operte-${record.userId}`}
                    overlay={
                      <Menu key={`user-menu-${record.userId}`}>
                        <Auth
                          key={`user-edit-auth-${record.userId}`}
                          permission="system:user:edit"
                          render={() => (
                            <Menu.Item key={`user-edit-item-${record.userId}`}>
                              <a
                                onClick={() =>
                                  formRef.current?.edit((record as unknown) as SysUserDto)
                                }
                              >
                                编辑
                              </a>
                            </Menu.Item>
                          )}
                        />
                        <Auth
                          key={`user-grant-auth-${record.userId}`}
                          permission="system:user:grant"
                          render={() => (
                            <Menu.Item key={`user-grant-item-${record.userId}`}>
                              <a
                                onClick={() => {
                                  setGrateRecord(record);
                                  setgrateVisible(true);
                                }}
                              >
                                授权
                              </a>
                            </Menu.Item>
                          )}
                        />
                        <Auth
                          key={`user-pass-auth-${record.userId}`}
                          permission="system:user:pass"
                          render={() => (
                            <Menu.Item key={`user-pass-item-${record.userId}`}>
                              <a
                                onClick={() => {
                                  setPassRecord(record);
                                  setPassVisible(true);
                                }}
                              >
                                改密
                              </a>
                            </Menu.Item>
                          )}
                        />
                        <Auth
                          key={`user-del-auth-${record.userId}`}
                          permission="system:user:del"
                          render={() => (
                            <Menu.Item key={`user-del-item-${record.userId}`}>
                              <Popconfirm
                                key="user-del-popconfirm"
                                title={`确认要删除吗?`}
                                overlayStyle={{ width: '150px' }}
                                onConfirm={() => {
                                  user.del(record).then(() => {
                                    message.success('删除成功!');
                                    tableRef.current?.reload();
                                  });
                                }}
                              >
                                <a style={{ color: 'red' }}>删除</a>
                              </Popconfirm>
                            </Menu.Item>
                          )}
                        />
                      </Menu>
                    }
                  >
                    <a style={{ userSelect: 'none' }}>操作</a>
                  </Dropdown>
                );
              },
            ]}
            operateBarProps={{ width: 70 }}
            toolBarActions={[
              selectedRowKeys && selectedRowKeys.length > 0 ? (
                <Dropdown
                  overlay={
                    <Menu
                      key="multiple-dropdown"
                      onClick={({ key }) => {
                        user.updateStatus(selectedRowKeys, key === 'open' ? 1 : 0).then(() => {
                          message.success('操作成功!');
                          tableRef.current?.reload();
                        });
                      }}
                    >
                      <Menu.Item key="open">
                        <DeleteOutlined style={{ marginRight: '10px' }} />
                        开启
                      </Menu.Item>
                      <Menu.Item key="lock">
                        <LockOutlined style={{ marginRight: '10px' }} />
                        锁定
                      </Menu.Item>
                    </Menu>
                  }
                >
                  <Button>
                    批量操作
                    <DownOutlined style={{ marginLeft: '5px' }} />
                  </Button>
                </Dropdown>
              ) : (
                <></>
              ),

              { type: 'create', permission: 'system:user:add' },
            ]}
            tableProps={{
              params: {
                // @ts-ignore
                organizationId: oIds && oIds.length > 0 ? oIds.join(',') : undefined,
              },
              rowSelection: {
                fixed: true,
                type: 'checkbox',
                selectedRowKeys,
                onChange: (keys) => {
                  setSelectedRowKeys(keys);
                },
                alwaysShowAlert: true,
              },
              tableAlertOptionRender: false,
              tableAlertRender: () => {
                return (
                  <>
                    <InfoOutlined style={{ color: '#1890ff', marginRight: 5, fontSize: 14 }} />
                    已选择: <span style={{ color: '#1890ff' }}>{selectedRowKeys.length}</span>
                    <a onClick={() => setSelectedRowKeys([])} style={{ marginLeft: '24px' }}>
                      清空
                    </a>
                  </>
                );
              },
            }}
            formProps={{ titleSuffix: '用户' }}
            onStatusChange={setStatus}
          >
            <Row>
              <Col xs={24} sm={24} md={12}>
                <ProFormText name="userId" hidden />
                <ProFormText
                  name="username"
                  label="用户名"
                  rules={[{ required: true, message: '请输入用户名!' }]}
                />

                {status === 'edit' ? (
                  <></>
                ) : (
                  <ProFormText.Password
                    name="pass"
                    label="密码"
                    rules={[{ required: true, message: '请输入密码!' }]}
                  />
                )}

                <ProFormText
                  name="nickname"
                  label="昵称"
                  rules={[{ required: true, message: '请输入昵称!' }]}
                />

                <Form.Item name="organizationId" label="组织">
                  <TreeSelect treeData={treeData} />
                </Form.Item>

                <FormDictRadio
                  name="status"
                  label="状态"
                  code="user_status"
                  initialValue={1}
                  dictProps={{ radioType: 'button' }}
                />
              </Col>

              <Col xs={24} sm={24} md={12}>
                <FormDictRadio
                  name="sex"
                  label="性别"
                  code="gender"
                  dictProps={{ radioType: 'button' }}
                  initialValue={1}
                />

                <ProFormText name="phone" label="电话" />

                <ProFormText name="email" label="邮箱" />

                {status === 'edit' ? (
                  <></>
                ) : (
                  <Form.Item name="roleCodes" label="角色" initialValue={[]}>
                    <SelectRole />
                  </Form.Item>
                )}
              </Col>
            </Row>
          </Page.Modal>
        </Col>
      </Row>

      <Grant visible={grateVisible} onVisibleChange={setgrateVisible} record={grateRecord} />

      <Pass visible={passVisible} onVisibleChange={setPassVisible} record={passRecord} />

      <Cropper.Avatar
        visible={avatarData !== undefined}
        onVisibleChange={(flag) => {
          if (!flag) {
            setAvatarData(undefined);
          }
        }}
        onSave={async (blob, file) => {
          if (!avatarData) {
            message.error('请指定要更新头像的用户!');
            setAvatarData(undefined);
            return Promise.resolve();
          }
          return user.updateAvatar(avatarData, blob, file).then(() => setAvatarData(undefined));
        }}
      />
    </>
  );
};
