import { useRef } from 'react';
import type { ActionType } from '@ant-design/pro-table';
import type { ModalFormRef } from '@/components/Form';
import ModalForm from '@/components/Form/ModalForm';
import type { ModalPageProps } from './typings';
import I18n from '@/utils/I18nUtils';
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

  return (
    <>
      <BasePage<T, U, E, ValueType>
        rowKey={rowKey}
        columns={columns}
        query={query}
        title={title}
        toolBarActions={toolBarActions}
        operateBar={operateBar}
        operteBarProps={operteBarProps}
        perStatusChange={perStatusChange}
        formData={formData}
        del={del}
        tableProps={{ ...tableProps }}
        tableRef={tableRef}
        formRef={formRef}
      >
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
          onError={onError}
        >
          {children}
        </ModalForm>
      </BasePage>
    </>
  );
};

export default ModalPage;
