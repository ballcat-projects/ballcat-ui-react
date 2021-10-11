import React, { useState, useEffect, useRef } from 'react';
import Table from '@/components/Table';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import type { FormStatus, FullFormRef } from '@/components/Form';
import I18n from '@/utils/I18nUtils';
import utils from './utils';
import FullForm from '../Form/FullForm';
import type { FullPageProps } from '.';

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
  onError = () => {},
  children,
  operateBar,
  operteBarProps,
  formData = (data) => {
    return data as unknown as E;
  },
  del,
  handlerData,
  tableProps,
  modalProps,
  tableRef: tr,
  modalRef: mr,
  perStatusChange = () => undefined,
}: FullPageProps<T, U, E, P, ValueType>) => {
  let tableRef = useRef<ActionType>();
  let modalRef = useRef<FullFormRef<E>>();

  if (mr) {
    modalRef = mr;
  }

  if (tr) {
    tableRef = tr;
  }

  const [toolBarActionsList, setToolBarActionsList] = useState<React.ReactNode[]>([]);
  const [tableColumns, setTableColumns] = useState<ProColumns<T, ValueType>[]>([]);
  const [tableStyle, setTableStyle] = useState<React.CSSProperties>({});

  // 表格上方工具栏更新
  useEffect(() => {
    setToolBarActionsList(
      utils.generateToolBarActionsList(perStatusChange, modalRef, toolBarActions),
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
          modalRef,
          tableRef,
          del,
          operteBarProps,
        ),
      );
    }

    setTableColumns(newColumns);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns, operateBar]);

  const formStatusChange = (status: FormStatus) => {
    if (status) {
      // 表单状态不为空
      setTableStyle({ ...tableProps?.style, display: 'none' });
    } else {
      setTableStyle({ ...tableProps?.style });
    }
    if (onStatusChange) {
      onStatusChange(status);
    }
  };

  return (
    <>
      <Table<T, U, ValueType>
        {...tableProps}
        style={tableStyle}
        rowKey={rowKey}
        columns={tableColumns}
        request={query}
        headerTitle={title}
        actionRef={tableRef}
        toolbar={{ ...tableProps?.toolbar, actions: toolBarActionsList }}
      />

      <FullForm<E, P>
        {...modalProps}
        mfRef={modalRef}
        onStatusChange={formStatusChange}
        handlerData={handlerData}
        create={create}
        edit={edit}
        onFinish={(st, body) => {
          tableRef.current?.reload();
          onFinish(st, body);
          I18n.success('global.operation.success');
        }}
        onError={onError}
      >
        {children}
      </FullForm>
    </>
  );
};

export default ModalPage;
