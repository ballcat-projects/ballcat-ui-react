import React, { useRef, useState } from 'react';
import type { ActionType } from '@ant-design/pro-table';
import type { FormStatus, FullFormRef } from '@/components/Form';
import I18n from '@/utils/I18nUtils';
import FullForm from '../Form/FullForm';
import type { FullPageProps } from '.';
import BasePage from './BasePage';

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
  operateBarProps,
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
}: FullPageProps<T, U, E, P, ValueType>) => {
  let tableRef = useRef<ActionType>();
  let formRef = useRef<FullFormRef<E>>();

  if (pFormRef) {
    formRef = pFormRef;
  }

  if (pTableRef) {
    tableRef = pTableRef;
  }

  const [tableStyle, setTableStyle] = useState<React.CSSProperties>({});

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
      <BasePage<T, U, E, ValueType>
        rowKey={rowKey}
        columns={columns}
        query={query}
        title={title}
        toolBarActions={toolBarActions}
        operateBar={operateBar}
        operateBarProps={operateBarProps}
        perStatusChange={perStatusChange}
        formData={formData}
        del={del}
        tableProps={{ ...tableProps, style: tableStyle }}
        tableRef={tableRef}
        formRef={formRef}
      >
        <FullForm<E, P>
          {...formProps}
          formRef={formRef}
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
      </BasePage>
    </>
  );
};

export default ModalPage;
