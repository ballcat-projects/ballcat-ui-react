import { useState, useRef } from 'react';
import type { SysMenuDto, SysMenuQo, SysMenuVo } from '@/services/ballcat/system';
import type { ProColumns } from '@ant-design/pro-table';
import type { FormRef, FormStatus } from '@/components/LtForm';
import { LtFormNumber } from '@/components/LtForm';
import { LtFormDictRadio } from '@/components/LtForm';
import { ProFormText } from '@ant-design/pro-form';
import LtPage from '@/components/LtPage';
import { Button, Form, TreeSelect } from 'antd';
import { menu } from '@/services/ballcat/system';
import { ofList } from '@/utils/TreeUtils';
import { Icon } from '@/components/Icon';

const dataColumns: ProColumns<SysMenuVo>[] = [
  {
    title: (_, type) => (type === 'table' ? 'ID' : '菜单ID'),
    dataIndex: 'id',
    width: 80,
  },
  {
    title: '菜单名称',
    dataIndex: 'title',
    width: 200,
    hideInTable: true,
  },
  {
    title: '菜单名称',
    dataIndex: 'i18nTitle',
    width: 200,
    hideInSearch: true,
  },
  {
    title: '权限标识',
    dataIndex: 'permission',
    width: 150,
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

export default () => {
  const modalRef = useRef<FormRef<SysMenuDto>>();
  const [status, setStatus] = useState<FormStatus>(undefined);
  const [treeSelectData, setTreeSelectData] = useState<any[]>([
    { value: 0, label: '【根目录】0', children: [] },
  ]);
  const [showI18n, setShowI18n] = useState(true);

  return (
    <LtPage<SysMenuVo, SysMenuQo, SysMenuDto>
      {...menu}
      title="菜单权限"
      rowKey="id"
      columns={dataColumns}
      onStatusChange={setStatus}
      toolBarActions={['create']}
      modalRef={modalRef}
      operateBar={[
        (dom, record) => (
          <a
            key="items"
            onClick={() => {
              // 添加子项时, 子项的默认父级是当前选中项 | type 最大值为2
              modalRef.current?.create({ parentId: record.id, type: Math.min(record.type + 1, 2) });
            }}
          >
            添加
          </a>
        ),
        {
          type: 'edit',
          permission: 'system:dict:edit',
          props: { prefix: true },
        },
        {
          type: 'del',
          permission: 'system:dict:del',
          props: { prefix: true },
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

      <LtFormNumber
        name="id"
        label="菜单ID"
        tooltip="菜单ID的长度固定为 6，由三部分构成。前两位是目录序号，中间两位是菜单序号，最后两位是按钮序号。例如目录的ID结构应为：XX0000，菜单结构为 XXXX00，按钮ID结构为 XXXXXX"
      />

      <LtFormNumber name="sort" label="显示排序" placeholder="排序值(升序)" />

      <ProFormText
        name="title"
        label="菜单名称"
        addonAfter={
          <Button onClick={() => setShowI18n(!showI18n)} type="primary">
            {!showI18n ? (
              <>
                <Icon type="ballcat-icon-down" /> 展开
              </>
            ) : (
              <>
                <Icon type="ballcat-icon-up" /> 收起
              </>
            )}
            国际化配置
          </Button>
        }
      />

      <Form.Item label="菜单名称国际化"></Form.Item>
    </LtPage>
  );
};
