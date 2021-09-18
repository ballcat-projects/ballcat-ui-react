import { useRef, useEffect } from 'react';
import { message, Form } from 'antd';
import type { SysUserScopeDto, SysUserVo } from '@/services/ballcat/system';
import { user } from '@/services/ballcat/system';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import SelectRole from './SelectRole';

type GrateProps = {
  visible: boolean;
  onVisibleChange: (val: boolean) => void;
  record?: SysUserVo;
};

export default ({ visible, onVisibleChange, record }: GrateProps) => {
  const formRef = useRef<ProFormInstance<SysUserScopeDto>>();

  useEffect(() => {
    formRef.current?.resetFields();
    if (record) {
      user.getScope(record).then(({ data }) => {
        formRef.current?.setFieldsValue({
          userId: record.userId,
          username: record.username,
          roleCodes: data.roleCodes,
        });
      });
    }
  }, [record]);

  return (
    <ModalForm
      title="授权"
      visible={visible}
      formRef={formRef}
      onVisibleChange={onVisibleChange}
      onFinish={(values) => {
        return user
          .putScope({
            userId: values.userId,
            roleCodes: values.roleCodes,
          })
          .then(() => {
            message.success('授权成功!');
            formRef.current?.resetFields();
            return true;
          });
      }}
    >
      <ProFormText hidden name="userId" />
      <ProFormText disabled name="username" label="用户名" />

      <Form.Item name="roleCodes" label="角色" initialValue={[]}>
        <SelectRole />
      </Form.Item>
    </ModalForm>
  );
};
