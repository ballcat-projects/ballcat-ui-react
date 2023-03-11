import type { FormItemProps, TagProps as AntdTagProps } from 'antd';
import { Form, Tag as AntdTag } from 'antd';
import type { PresetColorType, PresetStatusColorType } from 'antd/lib/_util/colors';
import type { LiteralUnion } from 'antd/lib/_util/type';

type Props<V> = {
  fieldProps?: AntdTagProps;
  color?: LiteralUnion<PresetColorType | PresetStatusColorType, string>;
} & Omit<FormItemProps<V>, 'children'>;

type TagProps = {
  value?: any;
  onChange?: (val?: any) => void;
  fieldProps?: AntdTagProps;
};

const Tag = ({ value, fieldProps }: TagProps) => {
  return <>{value ? <AntdTag {...fieldProps}>{value}</AntdTag> : '-'}</>;
};

export const FormTag = <V,>(props: Props<V>) => {
  const { fieldProps, color, ...itemProps } = props;

  return (
    <Form.Item {...itemProps}>
      <Tag fieldProps={{ ...fieldProps, color: color || fieldProps?.color }} />
    </Form.Item>
  );
};
