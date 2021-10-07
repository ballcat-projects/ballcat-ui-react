import { useState, useRef, useImperativeHandle } from 'react';
import type { FormStatus } from './typings';
import type { ProFormInstance } from '@ant-design/pro-form';
import ProForm from '@ant-design/pro-form';
import type { R } from '@/typings';
import I18n from '@/utils/I18nUtils';
import type { LtFullFormProps } from '.';
import { Button, Card } from 'antd';

export const defautlTitle = {
  read: I18n.text('form.read'),
  edit: I18n.text('form.edit'),
  create: I18n.text('form.create'),
  del: I18n.text('form.del'),
};

const LtFullForm = <E, P = E>(props: LtFullFormProps<E, P>) => {
  const {
    mfRef,
    onStatusChange = () => {},
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

  const [title, setTitle] = useState<string | undefined>(undefined);
  const [hidden, setHidden] = useState<boolean>(true);
  const [status, setStatus] = useState<FormStatus>(undefined);
  const [loading, setLoading] = useState(false);

  const changeStatus = (st: FormStatus) => {
    setStatus(st);
    onStatusChange(st);
  };

  const switchStatus = (st: FormStatus, data?: any) => {
    changeStatus(st);

    if (st === undefined) {
      setHidden(true);
      setTitle(undefined);
      return;
    }
    // 清空数据
    formRef.current?.resetFields();
    // 如果需要回填数据
    if (data !== undefined && data !== null) {
      formRef.current?.setFieldsValue(data);
    }
    setTitle(`${defautlTitle[st]}${titleSuffix}`);
    setHidden(false);
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
    setLoading(true);
    const body = handlerData(values as E, st);
    return req(body)
      .then(() => {
        onFinish(status, body);
        switchStatus(undefined);
        return Promise.resolve(true);
      })
      .finally(() => {
        setLoading(false);
      });
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
    <Card title={title}>
      <ProForm<E>
        submitter={{
          render: () => {
            return [
              <Button type="primary" htmlType="submit" loading={loading}>
                提交
              </Button>,
              <Button onClick={() => switchStatus(undefined)}>取消</Button>,
            ];
          },
        }}
        {...antProps}
        layout="horizontal"
        hidden={hidden}
        labelCol={labelCol || { sm: { span: 24 }, md: { span: 4 } }}
        wrapperCol={wrapperCol}
        formRef={formRef}
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
      </ProForm>
    </Card>
  );
};

export default LtFullForm;
