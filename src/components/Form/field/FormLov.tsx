import type { LovProps } from '@/components/Lov';
import Lov from '@/components/Lov';
import type { FormItemProps } from 'antd';
import { Form } from 'antd';

type Props<V, E> = {
  fieldProps?: Partial<LovProps<V, E>>;
  keyword: LovProps<V, E>['keyword'];
} & Omit<FormItemProps<V>, 'children'>;

export const FormLov = <V, E = any>(props: Props<V, E>) => {
  const { fieldProps, keyword, ...itemProps } = props;

  return (
    <Form.Item {...itemProps}>
      <Lov {...fieldProps} keyword={keyword} />
    </Form.Item>
  );
};
