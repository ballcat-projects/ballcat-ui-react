import { useState, useRef, useImperativeHandle } from 'react';
import type { LtModalFormProps, FormStatus } from './typings';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ModalForm } from '@ant-design/pro-form';
import type { R } from '@/typings';
import I18n from '@/utils/I18nUtils';

export const defautlTitle = {
  read: I18n.text('form.read'),
  edit: I18n.text('form.edit'),
  create: I18n.text('form.create'),
  del: I18n.text('form.del'),
};

const LtModalForm = <E, P = E>(props: LtModalFormProps<E, P>) => {
  const {
    mfRef,
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
      I18n.error({ key: 'orm.error.request', params: { title: defautlTitle[st] } });
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

  useImperativeHandle(mfRef, () => ({
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
    getFormRef: () => formRef.current,
    hidden: () => {
      switchStatus(undefined);
    },
  }));

  return (
    <ModalForm<E>
      {...antProps}
      width={width}
      layout="horizontal"
      labelCol={labelCol || { sm: { span: 24 }, md: { span: 4 } }}
      wrapperCol={wrapperCol}
      formRef={formRef}
      title={modalTitle}
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
    >
      {children}
    </ModalForm>
  );
};

export default LtModalForm;
