import { Form, InputNumber } from 'antd';
import type { FormNumberProps } from './typings';

function LtFormNumber<V = any>(props: FormNumberProps<V>) {
  const { name, label, formItemProps, inputProps } = props;

  return (
    <Form.Item<V> {...formItemProps} name={name} label={label}>
      <InputNumber<number> style={{ width: '100%' }} {...inputProps} />
    </Form.Item>
  );
}

export default LtFormNumber;
