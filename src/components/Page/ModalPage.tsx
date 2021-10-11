import React, { useState, useEffect, useRef } from 'react';
import Table from '@/components/Table';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import type { ModalFormRef } from '@/components/Form';
import ModalForm from '@/components/Form/ModalForm';
import type { ModalPageProps } from './typings';
import I18n from '@/utils/I18nUtils';
import utils from './utils';

const ModalPage = <T, U, E, P = E, ValueType = 'text'>({
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
  operteBarProps,
  formData = (data) => {
    return data as unknown as E;
  },
  del,
  handlerData,
  tableProps,
  formProps,
  tableRef: pTableRef,
  formRef: pFormRef,
  perStatusChange = () => undefined,
}: ModalPageProps<T, U, E, P, ValueType>) => {
  let tableRef = useRef<ActionType>();
  let formRef = useRef<ModalFormRef<E>>();

  if (pFormRef) {
    formRef = pFormRef;
  }

  if (pTableRef) {
    tableRef = pTableRef;
  }

  const [toolBarActionsList, setToolBarActionsList] = useState<React.ReactNode[]>([]);
  const [tableColumns, setTableColumns] = useState<ProColumns<T, ValueType>[]>([]);

  // 表格上方工具栏更新
  useEffect(() => {
    setToolBarActionsList(
      utils.generateToolBarActionsList(perStatusChange, formRef, toolBarActions),
    );
  }, [toolBarActions]);

  // 表格列更新
  useEffect(() => {
    const newColumns = columns ? [...columns] : [];

    if (operateBar && operateBar.length > 0) {
      newColumns.push(
        utils.generateOperateBar(
          operateBar,
          rowKey,
          perStatusChange,
          formData,
          formRef,
          tableRef,
          del,
          operteBarProps,
        ),
      );
    }

    setTableColumns(newColumns);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns, operateBar]);

  return (
    <>
      <Table<T, U, ValueType>
        {...tableProps}
        rowKey={rowKey}
        columns={tableColumns}
        request={query}
        headerTitle={title}
        actionRef={tableRef}
        toolbar={{ ...tableProps?.toolbar, actions: toolBarActionsList }}
      />

      <ModalForm<E, P>
        {...formProps}
        formRef={formRef}
        onStatusChange={onStatusChange}
        handlerData={handlerData}
        create={create}
        edit={edit}
        onFinish={(st, body) => {
          tableRef.current?.reload();
          onFinish(st, body);
          I18n.success('global.operation.success');
        }}
      >
        {children}
      </ModalForm>
    </>
  );
};

export default ModalPage;
