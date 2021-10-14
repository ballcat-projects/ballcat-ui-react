import { useState, useRef, useImperativeHandle } from 'react';
import type { FormStatus } from './typings';
import type { ProFormInstance } from '@ant-design/pro-form';
import ProForm from '@ant-design/pro-form';
import type { R } from '@/typings';
import I18n from '@/utils/I18nUtils';
import type { FullFormProps } from '.';
import { defautlTitle } from '.';
import { Button, Card } from 'antd';

const FullForm = <E, P = E>(props: FullFormProps<E, P>) => {
  const {
    formRef: currencyRef,
    onStatusChange = () => {},
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
      })
      .catch((e) => onError(e));
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
    <Card title={title} hidden={hidden}>
      <ProForm<E>
        submitter={{
          render: () => {
            return [
              <Button
                key="lt-full-form-submitter-submit"
                type="primary"
                htmlType="submit"
                loading={loading}
              >
                提交
              </Button>,
              <Button key="lt-full-form-submitter-cancel" onClick={() => switchStatus(undefined)}>
                取消
              </Button>,
            ];
          },
        }}
        layout="horizontal"
        labelCol={labelCol || { sm: { span: 24 }, md: { span: 4 } }}
        wrapperCol={wrapperCol}
        {...antProps}
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

export default FullForm;
