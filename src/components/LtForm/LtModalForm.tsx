import { useState, useRef, useImperativeHandle } from 'react';
import { message } from 'antd';
import type { ModalFormProps, FormStatus } from './typings';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ModalForm } from '@ant-design/pro-form';
import type { R } from '@/typings';

const defautlTitle = {
  read: '展示',
  edit: '编辑',
  create: '新增',
};

const LtModalForm = <E, P = E>(props: ModalFormProps<E, P>) => {
  const {
    mfRef,
    onStatusChange,
    width,
    labelCol,
    wrapperCol,
    title,
    children,
    create,
    edit,
    handlerData,
    onFinish,
  } = props;
  const formRef = useRef<ProFormInstance<E>>();

  const [modalTitle, setModalTitle] = useState<string | undefined>(undefined);
  const [visible, setVisible] = useState<boolean>(false);
  const [status, setStatus] = useState<FormStatus>(undefined);

  const changeStatus = (st: FormStatus) => {
    setStatus(st);
    if (onStatusChange) {
      onStatusChange(st);
    }
  };

  const submit = async (
    values: Record<string, any>,
    st: 'read' | 'edit' | 'create',
    req?: (body: P) => Promise<R<any>>,
  ) => {
    if (req === undefined) {
      message.error(`该表单未配置${defautlTitle[st]}请求, 无法进行对应操作!`);
      return Promise.resolve(false);
    }

    const body = handlerData ? handlerData(values as E, st) : (values as P);
    return req(body).then(() => {
      if (onFinish) {
        onFinish(status, body);
      }
      return Promise.resolve(true);
    });
  };

  const switchStatus = (st: FormStatus) => {
    changeStatus(st);

    if (st === undefined) {
      setVisible(false);
      setModalTitle(undefined);
      return;
    }
    // 清空数据
    formRef.current?.resetFields();
    setModalTitle(title && title[st] ? title[st] : defautlTitle[st]);
    setVisible(true);
  };

  useImperativeHandle(mfRef, () => ({
    // 只读
    read: (row: E) => {
      switchStatus('read');
      // 回填
      formRef.current?.setFieldsValue({ ...row });
    },
    // 编辑
    edit: (row: E) => {
      switchStatus('edit');
      // 回填
      formRef.current?.setFieldsValue({ ...row });
    },
    // 新增
    create: () => {
      switchStatus('create');
    },
    getFormRef: () => formRef.current,
  }));

  return (
    <ModalForm
      width={width}
      layout="horizontal"
      labelCol={labelCol || { span: 4 }}
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
            message.error('表单状态异常!请刷新页面.');
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
