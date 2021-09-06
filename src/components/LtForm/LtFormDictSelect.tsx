import { Form } from 'antd';
import { DictSelect } from '../Dict';
import type { FormDictRadioProps } from './typings';

function LtFormDictSelect<V = any>(props: FormDictRadioProps<V>) {
  const { name, label, code, formItemProps, dictProps } = props;

  return (
    <Form.Item {...formItemProps} name={name} label={label}>
      <DictSelect {...dictProps} code={code} />
    </Form.Item>
  );
}

export default LtFormDictSelect;
