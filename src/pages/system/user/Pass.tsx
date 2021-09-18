import { useRef, useEffect } from 'react';
import { message, Form, Input } from 'antd';
import type { SysUserPassDto, SysUserVo } from '@/services/ballcat/system';
import { user } from '@/services/ballcat/system';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { pwd } from '@/utils/Encrypt';

type PassProps = {
  visible: boolean;
  onVisibleChange: (val: boolean) => void;
  record?: SysUserVo;
};

export default ({ visible, onVisibleChange, record }: PassProps) => {
  const formRef = useRef<ProFormInstance<SysUserPassDto>>();

  useEffect(() => {
    formRef.current?.resetFields();
    if (record) {
      formRef.current?.setFieldsValue(record);
    }
  }, [record]);

  return (
    <ModalForm
      title="修改密码"
      visible={visible}
      formRef={formRef}
      onVisibleChange={onVisibleChange}
      onFinish={(values) => {
        return user
          .changePassword({
            userId: values.userId,
            pass: pwd.encrypt(values.pass),
          })
          .then(() => {
            message.success('修改密码成功!');
            formRef.current?.resetFields();
            return true;
          });
      }}
    >
      <ProFormText hidden name="userId" />
      <ProFormText disabled name="username" label="用户名" />

      <Form.Item
        name="pass"
        label="新密码"
        rules={[
          {
            required: true,
            pattern: /^(?=.*\d)(?=.*[a-zA-Z]).{6,12}$/,
            message: '密码必须包含数字和字母组合(可使用特殊符号)，长度为6-12位！',
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirmPass"
        label="确认密码"
        dependencies={['pass']}
        rules={[
          {
            required: true,
            message: '请输入密码!',
          },
          (form) => {
            return {
              validator: (rule, val) => {
                let msg;
                if (form.getFieldValue('pass') !== val) {
                  msg = '两次输入的密码不一致!';
                }

                if (msg && msg.length > 0) {
                  return Promise.reject(msg);
                }

                return Promise.resolve();
              },
            };
          },
        ]}
      >
        <Input.Password />
      </Form.Item>
    </ModalForm>
  );
};
