import { useState, useRef } from 'react';
import type { SysI18nListVo, SysMenuDto, SysMenuQo, SysMenuVo } from '@/services/ballcat/system';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import type { FormStatus, ModalFormRef } from '@/components/LtForm';
import LtForm, { LtFormNumber } from '@/components/LtForm';
import { LtFormDictRadio } from '@/components/LtForm';
import { ProFormRadio, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import LtPage from '@/components/LtPage';
import { message, Button, Form, Modal, TreeSelect } from 'antd';
import { menu, i18n } from '@/services/ballcat/system';
import { ofList } from '@/utils/TreeUtils';
import Icon, { IconSelect } from '@/components/Icon';
import SysMenuI18nForm from './SysMenuI18n';
import I18n from '@/utils/I18nUtils';
import Auth from '@/components/Auth';

const isBtn = (data: SysMenuVo | any) => {
  return data.type === 2 || data === 2;
};

const isMenu = (data: SysMenuVo | any) => {
  return data.type === 1 || data === 1;
};
const isDir = (data: SysMenuVo | any) => {
  return data.type === 0 || data === 0;
};

export default () => {
  const modalRef = useRef<ModalFormRef<SysMenuDto>>();
  const tableRef = useRef<ActionType>();
  const [status, setStatus] = useState<FormStatus>(undefined);
  const [treeSelectData, setTreeSelectData] = useState<any[]>([
    { value: 0, label: '【根目录】0', children: [] },
  ]);
  const [showI18n, setShowI18n] = useState(true);
  const [i18nVisible, setI18nVisible] = useState<boolean>(false);
  const [i18nCode, setI18nCode] = useState<string | undefined>(undefined);
  const [i18nData, setI18nData] = useState<SysI18nListVo[]>([]);

  const editI18n = (code: string) => {
    if (code && code.length > 0) {
      modalRef.current?.hidden();
      setI18nCode(code);
      setI18nData([]);
      setI18nVisible(true);
      i18n.listByCode(code).then((res) => {
        const { data } = res;
        if (data.length > 0) {
          setI18nData(data);
        } else {
          message.warning('未找到对应的国际化数据!');
          setI18nVisible(false);
        }
      });
    } else {
      message.error('请输入菜单名称!');
    }
  };

  const dataColumns: ProColumns<SysMenuVo>[] = [
    {
      title: (_, type) => (type === 'table' ? 'ID' : '菜单ID'),
      dataIndex: 'id',
      width: 80,
    },
    {
      title: '菜单名称',
      dataIndex: 'title',
      hideInTable: true,
    },
    {
      title: '菜单名称',
      dataIndex: 'i18nTitle',
      width: 200,
      hideInSearch: true,
      render: (dom, record) => {
        return (
          <>
            <Icon type={record.icon} /> {record.i18nTitle}{' '}
            {isBtn(record) ? (
              ''
            ) : (
              <Icon type="edit" style={{ fontSize: 14 }} onClick={() => editI18n(record.title)} />
            )}
          </>
        );
      },
    },
    {
      title: '权限标识',
      dataIndex: 'permission',
      width: 150,
      copyable: true,
      ellipsis: true,
      hideInSearch: true,
    },

    {
      title: '路由地址',
      dataIndex: 'path',
      width: 120,
      ellipsis: true,
    },
    {
      title: '资源路径',
      dataIndex: 'uri',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '排序',
      dataIndex: 'sort',
      width: 50,
      hideInSearch: true,
    },
    {
      title: '可见',
      dataIndex: 'hidden',
      width: 50,
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 150,
      hideInSearch: true,
    },
  ];

  return (
    <>
      <LtPage<SysMenuVo, SysMenuQo, SysMenuDto>
        {...menu}
        title="菜单权限"
        rowKey="id"
        columns={dataColumns}
        onStatusChange={setStatus}
        toolBarActions={[{ type: 'create', permission: 'system:menu:add' }]}
        modalRef={modalRef}
        tableRef={tableRef}
        operateBar={[
          (dom, record) => {
            return (
              <Auth.A
                key={`menu-item-add-${record.id}`}
                domKey={`auth-record-add-${record.id}`}
                text="添加"
                permission="system:menu:add"
                onClick={() => {
                  // 子项的类型 type 最大值为2
                  const type = Math.min(record.type + 1, 2);
                  // 子项的父级 , 如果是按钮. 不能添加子项. 所以和它自己平级
                  const parentId = isBtn(record) ? record.parentId : record.id;
                  modalRef.current?.create({ parentId, type });
                }}
              />
            );
          },
          {
            type: 'edit',
            permission: 'system:menu:edit',
          },
          {
            type: 'del',
            permission: 'system:menu:del',
          },
        ]}
        tableProps={{
          pagination: false,
          expandable: { expandIconColumnIndex: 1 },
          postData: (data) => {
            const treeData = ofList(data, 0, (item) => {
              // eslint-disable-next-line no-param-reassign
              item.label = `【${item.i18nTitle}】${item.id}`;
              // eslint-disable-next-line no-param-reassign
              item.value = item.id;
              if (isBtn(item)) {
                // 禁止使用按钮作为父级
                // eslint-disable-next-line no-param-reassign
                item.disabled = true;
              }
              return item;
            });
            treeSelectData[0].children = treeData;
            setTreeSelectData(treeSelectData);
            return treeData;
          },
        }}
        formData={(data) => {
          return { ...data, originalId: data.id, i18nMessages: [] };
        }}
        perStatusChange={() => {
          setShowI18n(true);
        }}
      >
        <ProFormText
          rules={
            status === 'edit'
              ? [{ required: true, message: '表单数据异常. 请关闭后重试' }]
              : undefined
          }
          name="originalId"
          hidden
          tooltip
        />

        <Form.Item label="上级菜单" name="parentId" initialValue={0}>
          <TreeSelect
            treeData={treeSelectData}
            treeDefaultExpandedKeys={[0]}
            dropdownStyle={{ maxHeight: '350px', overflow: 'auto' }}
          />
        </Form.Item>

        <LtFormDictRadio code="menu_type" name="type" label="菜单类型" initialValue={0} />

        <LtForm.Group>
          <LtFormNumber
            name="id"
            label="菜单ID"
            tooltip="菜单ID的长度固定为 6，由三部分构成。前两位是目录序号，中间两位是菜单序号，最后两位是按钮序号。例如目录的ID结构应为：XX0000，菜单结构为 XXXX00，按钮ID结构为 XXXXXX"
            required
            dependencies={['type']}
            rules={[
              { required: true, message: '请输入菜单ID!' },
              (form) => {
                return {
                  validator: (rule, val) => {
                    let errorMsg = null;

                    const idStr = String(val);
                    if (idStr.length !== 6) {
                      errorMsg = 'ID长度必须为 6 位!';
                    } else {
                      const type = form.getFieldValue('type');

                      if (isDir(type)) {
                        if (!idStr.endsWith('0000')) {
                          errorMsg = '目录类型 ID 格式为 XX0000，xx 为目录编号!';
                        }
                      } else if (isMenu(type)) {
                        if (!idStr.endsWith('00')) {
                          errorMsg =
                            '菜单类型 ID 格式为 XXXX00，前两位 XX 为所属目录编号，后两位 XX 为菜单编号!';
                        }
                      }
                    }

                    if (errorMsg && errorMsg.length > 0) {
                      return Promise.reject(errorMsg);
                    }
                    return Promise.resolve();
                  },
                };
              },
            ]}
          />

          <LtFormNumber
            name="sort"
            label="显示排序"
            placeholder="排序值(升序)"
            initialValue={1}
            min={0}
            required
          />
        </LtForm.Group>

        <Form.Item noStyle shouldUpdate>
          {(form) => {
            const type = form.getFieldValue('type');
            let titleAddonAfter: React.ReactNode;
            if (status === 'edit' && !isBtn(type)) {
              titleAddonAfter = (
                <Button
                  type="primary"
                  onClick={() => {
                    editI18n(form.getFieldValue('title'));
                    modalRef?.current?.hidden();
                  }}
                >
                  编辑国际化配置
                </Button>
              );
            } else if (!isBtn(type)) {
              const iconType = showI18n ? 'down' : 'up';
              const textPrefix = showI18n ? '展开' : '收起';
              titleAddonAfter = (
                <Button hidden={isBtn(type)} onClick={() => setShowI18n(!showI18n)} type="primary">
                  <Icon type={iconType} />
                  {textPrefix}国际化配置
                </Button>
              );
            }

            return (
              <>
                <ProFormText
                  required
                  allowClear
                  name="title"
                  label="菜单名称"
                  placeholder="请输入菜单名称!"
                  rules={[{ required: true, message: '请输入菜单名称!' }]}
                  addonAfter={titleAddonAfter}
                  tooltip={
                    status === 'edit'
                      ? '如果修改了菜单名称. 请在保存菜单名称后再进行国际化编辑!'
                      : undefined
                  }
                />

                <Form.Item
                  label="菜单名称国际化"
                  tooltip="菜单标题将作为国际化信息的标识"
                  name="i18nMessages"
                  hidden={!showI18n || isBtn(type) || status === 'edit'}
                >
                  <SysMenuI18nForm code={form.getFieldValue('title')} />
                </Form.Item>

                {/* 不是按钮时展示 */}
                {isBtn(type) ? (
                  <></>
                ) : (
                  <LtForm.Group>
                    <Form.Item name="icon" label="菜单图标">
                      <IconSelect />
                    </Form.Item>

                    <ProFormText
                      name="path"
                      label="路由地址"
                      required
                      rules={[
                        { required: true, message: '请输入路由地址!' },
                        { pattern: /^[a-z0-9-]+$/, message: '仅小写字母、中划线、数字!' },
                      ]}
                    />
                  </LtForm.Group>
                )}

                {/* 仅在菜单类型为 菜单 时展示 */}
                {!isMenu(type) ? (
                  <></>
                ) : (
                  <>
                    <LtForm.Group>
                      <ProFormSelect
                        name="targetType"
                        label="打开方式"
                        initialValue={1}
                        options={[
                          { label: '内部组件', value: 1 },
                          { label: '内嵌页面', value: 2 },
                          { label: '外部链接', value: 3 },
                        ]}
                      />

                      <ProFormRadio.Group
                        name="keepAlive"
                        label="组件缓存"
                        initialValue={1}
                        options={[
                          { label: '开启', value: 1 },
                          { label: '关闭', value: 0 },
                        ]}
                      />
                    </LtForm.Group>

                    <ProFormText
                      required
                      name="uri"
                      label="资源路径"
                      rules={[{ required: true, message: '请输入资源路径!' }]}
                    />
                  </>
                )}

                {/* 不是按钮时展示 */}
                {isBtn(type) ? (
                  <></>
                ) : (
                  <ProFormRadio.Group
                    name="hidden"
                    label="是否可见"
                    initialValue={0}
                    options={[
                      { label: '显示', value: 0 },
                      { label: '隐藏', value: 1 },
                    ]}
                  />
                )}

                {/* 是按钮时展示 */}
                {!isBtn(type) ? (
                  <></>
                ) : (
                  <ProFormText
                    required
                    allowClear
                    name="permission"
                    label="授权标识"
                    rules={[{ required: true, message: '请输入授权标识!' }]}
                  />
                )}
              </>
            );
          }}
        </Form.Item>

        <ProFormTextArea name="remarks" label="备注信息" placeholder="最多输入 50 个字符!" />
      </LtPage>

      <Modal
        title={`国际化标识: ${i18nCode}`}
        visible={i18nVisible}
        onCancel={() => setI18nVisible(false)}
        onOk={() => setI18nVisible(false)}
        footer={false}
      >
        <EditableProTable<SysI18nListVo>
          rowKey="id"
          recordCreatorProps={false}
          value={i18nData}
          onChange={setI18nData}
          loading={i18nData.length === 0}
          cardProps={{ bodyStyle: { padding: 0 } }}
          bordered={true}
          editable={{
            actionRender: (row, config, dom) => [dom.save, dom.cancel],
            onSave: async (key, row) => {
              await i18n
                .edit(row)
                .then(() => {
                  I18n.success('global.operation.success');
                  tableRef.current?.reload();
                })
                .catch(async () => {
                  // 保存出错. 重新加载数据
                  const { data } = await i18n.listByCode(row.code);
                  setI18nData(data);
                });
            },
          }}
          columns={[
            { title: '语言', dataIndex: 'languageTag', width: 80, editable: false },
            {
              title: '文本',
              dataIndex: 'message',
              formItemProps: { rules: [{ required: true, message: '文本内容不能为空!' }] },
            },
            {
              title: '操作',
              width: 150,
              valueType: 'option',
              render: (text, recoed, _, action) => {
                return (
                  <a key="editable" onClick={() => action?.startEditable?.(recoed.id)}>
                    编辑
                  </a>
                );
              },
            },
          ]}
        />
      </Modal>
    </>
  );
};
