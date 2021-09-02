import React, { useState, useEffect, useRef } from 'react';
import { message, Button } from 'antd';
import LtTable from '@/components/LtTable';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import type { FormRef } from '@/components/LtForm';
import Auth from '@/components/Auth';
import { Icon } from '@/components/Icon';
import LtModalForm from '@/components/LtForm/LtModalForm';
import type { PageProps } from './typings';

const LtPage = <T, U, E, P = E, ValueType = 'text'>(props: PageProps<T, U, E, P, ValueType>) => {
  const {
    title,
    rowKey,
    query,
    columns,
    toolBarActions,
    onStatusChange,
    create,
    edit,
    onFinish = () => {},
    children,
    operateBar,
    formData = (data) => {
      return data as unknown as E;
    },
    del,
    handlerData,
    tableProps,
    modalProps,
    tableRef: tr,
    modalRef: mr,
  } = props;
  let tableRef = useRef<ActionType>();
  let modalRef = useRef<FormRef<E>>();

  if (mr) {
    modalRef = mr;
  }

  if (tr) {
    tableRef = tr;
  }

  const [toolBarActionsList, setToolBarActionsList] = useState<React.ReactNode[]>([]);
  const [tableColumns, setTableColumns] = useState<ProColumns<T, ValueType>[]>([]);

  // 表格上方工具栏更新
  useEffect(() => {
    setToolBarActionsList([]);
    if (toolBarActions && toolBarActions.length > 0) {
      const tbList: React.ReactNode[] = [];
      toolBarActions.forEach((tb) => {
        if (tb === 'create') {
          tbList.push(
            <Button
              type="primary"
              onClick={() => {
                modalRef.current?.create();
              }}
            >
              <Icon type={'ballcat-icon-plus'} /> 新建
            </Button>,
          );
        } else {
          tbList.push(tb);
        }
      });
      setToolBarActionsList(tbList);
    }
  }, [toolBarActions]);

  // 表格列更新
  useEffect(() => {
    const newColumns = [...columns];

    if (operateBar && operateBar.length > 0) {
      newColumns.push({
        title: '操作',
        width: 160,
        hideInSearch: true,
        fixed: 'right',
        render: (dom, record) => {
          const nodes: React.ReactNode[] = [];

          operateBar.forEach((ob, i) => {
            if (typeof ob === 'function') {
              nodes.push(ob(dom, record));
              return;
            }

            if (ob.type === 'edit') {
              nodes.push(
                <Auth.A
                  key={`lt-page-auth-edit-${i.toString}`}
                  text={'编辑'}
                  {...ob.props}
                  permission={ob.permission}
                  onClick={() => {
                    modalRef.current?.edit(formData(record));
                  }}
                />,
              );
            } else {
              nodes.push(
                <Auth.A
                  key={`lt-page-auth-del-${i.toString}`}
                  text={'删除'}
                  configTitle={'确定要删除吗'}
                  {...ob.props}
                  style={{ color: '#ff4d4f', ...ob.props?.style }}
                  permission={ob.permission}
                  onClick={() => {
                    if (del === undefined) {
                      message.error(`该表单未配置删除请求, 无法进行对应操作!`);
                      return;
                    }
                    del(record).then(() => {
                      tableRef.current?.reload();
                      message.success('操作成功!');
                    });
                  }}
                />,
              );
            }
          });

          return <>{nodes}</>;
        },
      });
    }

    setTableColumns(newColumns);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns, operateBar]);

  return (
    <>
      <LtTable<T, U, ValueType>
        {...tableProps}
        rowKey={rowKey}
        columns={tableColumns}
        request={query}
        headerTitle={title}
        actionRef={tableRef}
        toolbar={{ ...tableProps?.toolbar, actions: toolBarActionsList }}
      />

      <LtModalForm<E, P>
        {...modalProps}
        mfRef={modalRef}
        onStatusChange={onStatusChange}
        handlerData={handlerData}
        create={create}
        edit={edit}
        onFinish={(st, body) => {
          tableRef.current?.reload();
          onFinish(st, body);
          message.success('操作成功!');
        }}
      >
        {children}
      </LtModalForm>
    </>
  );
};

export default LtPage;