import React, { useState } from 'react';
import type { SysDict, SysDictVo } from '@/services/ballcat/system';
// import {dict} from '@/services/ballcat/system';
import { dict } from '@/services/ballcat/system';
import type { ProColumns } from '@ant-design/pro-table';
import type { FormStatus } from '@/components/LtForm';
import { ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import LtPage from '@/components/LtPage';
import SysDictItem from './SysDictItem';
import { DictTag } from '@/components/Dict';

const dataColumns: ProColumns<SysDictVo>[] = [
  {
    title: (_, type) => (type === 'table' ? '标识' : '字典标识'),
    dataIndex: 'code',
    copyable: true,
    ellipsis: true,
    width: 150,
  },
  {
    title: (_, type) => (type === 'table' ? '名称' : '字典名称'),
    dataIndex: 'title',
    ellipsis: true,
    width: 180,
  },
  {
    title: '属性',
    hideInSearch: true,
    dataIndex: 'editable',
    width: 60,
    render: (dom, record) => <DictTag code="dict_property" value={record.editable} />,
  },
  {
    title: '备注',
    hideInSearch: true,
    dataIndex: 'remarks',
    ellipsis: true,
  },
  {
    title: '创建时间',
    hideInSearch: true,
    dataIndex: 'createTime',
    ellipsis: true,
    width: 150,
    sorter: true,
  },
];

export default (): React.ReactNode => {
  const [status, setStatus] = useState<FormStatus>(undefined);
  const [itemShow, setItemShow] = useState(false);
  const [dictData, setDictData] = useState<SysDictVo>();

  return (
    <>
      <LtPage<SysDictVo, SysDictVo, SysDict>
        {...dict}
        rowKey="id"
        columns={dataColumns}
        onStatusChange={setStatus}
        toolBarActions={['create']}
        operateBar={[
          {
            type: 'edit',
            permission: 'system:dict:edit',
            props: { suffix: true },
          },
          (dom, record) => (
            <a
              key="items"
              onClick={() => {
                setDictData(record);
                setItemShow(true);
              }}
            >
              字典项
            </a>
          ),
          {
            type: 'del',
            permission: 'system:dict:del',
            props: { prefix: true },
          },
        ]}
      >
        <ProFormText name="id" hidden />
        <ProFormText
          label="标识"
          name="code"
          placeholder="字典标识"
          disabled={status !== 'create'}
        />
        <ProFormText label="名称" name="title" placeholder="字典名称" />

        <ProFormText label="字典属性" name="editable" />

        <ProFormText label="数据类型" name="valueType" />

        <ProFormTextArea label="备注" name="remarks" placeholder="备注" />
      </LtPage>

      <SysDictItem visible={itemShow} setVisible={setItemShow} dictData={dictData} />
    </>
  );
};
