import { useState, useRef, useImperativeHandle } from 'react';
import type { ModalFormProps, FormStatus } from './typings';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ModalForm as AntdModalForm } from '@ant-design/pro-form';
import type { R } from '@/typings';
import I18n from '@/utils/I18nUtils';
import { defautlTitle } from '.';

const ModalForm = <E, P = E>(props: ModalFormProps<E, P>) => {
  const {
    formRef: currencyRef,
    onStatusChange = () => {},
    width,
    labelCol,
    wrapperCol,
    titleSuffix = '',
    children,
    create,
    edit,
    handlerData = (body) => body as unknown as P,
    onFinish = () => {},
    onError = () => {},
    antProps,
  } = props;
  const formRef = useRef<ProFormInstance<E>>();

  const [modalTitle, setModalTitle] = useState<string | undefined>(undefined);
  const [visible, setVisible] = useState<boolean>(false);
  const [status, setStatus] = useState<FormStatus>(undefined);

  const changeStatus = (st: FormStatus) => {
    setStatus(st);
    onStatusChange(st);
  };

  const submit = async (
    values: Record<string, any>,
    st: 'read' | 'edit' | 'create',
    req?: (body: P) => Promise<R<any>>,
  ) => {
    if (req === undefined) {
      I18n.error({ key: 'form.error.request', params: { title: defautlTitle[st] } });
      return Promise.resolve(false);
    }

    const body = handlerData(values as E, st);
    return req(body).then(() => {
      onFinish(status, body);
      return Promise.resolve(true);
    });
  };

  const switchStatus = (st: FormStatus, data?: any) => {
    changeStatus(st);

    if (st === undefined) {
      setVisible(false);
      setModalTitle(undefined);
      return;
    }
    // 清空数据
    formRef.current?.resetFields();
    // 如果需要回填数据
    if (data !== undefined && data !== null) {
      formRef.current?.setFieldsValue(data);
    }
    setModalTitle(`${defautlTitle[st]}${titleSuffix}`);
    setVisible(true);
  };

  useImperativeHandle(currencyRef, () => ({
    // 只读
    read: (row: E) => {
      switchStatus('read', { ...row });
    },
    // 编辑
    edit: (row: E) => {
      switchStatus('edit', { ...row });
    },
    // 新增
    create: (data?: any) => {
      switchStatus('create', data);
    },
    getForm: () => formRef.current,
    hidden: () => {
      switchStatus(undefined);
    },
  }));

  return (
    <AntdModalForm<E>
      width={width}
      layout="horizontal"
      labelCol={labelCol || { sm: { span: 24 }, md: { span: 4 } }}
      wrapperCol={wrapperCol}
      title={modalTitle}
      {...antProps}
      formRef={formRef}
      visible={visible}
      onVisibleChange={setVisible}
      onFinish={async (values) => {
        switch (status) {
          case 'create':
            return submit(values, status, create);
          case 'edit':
            return submit(values, status, edit);
          default:
            I18n.error('form.error');
            break;
        }

        return Promise.resolve(false);
      }}
      onError={onError}
    >
      {children}
    </AntdModalForm>
  );
};

export default ModalForm;
