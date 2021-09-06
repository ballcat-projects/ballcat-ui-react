import { Form } from 'antd';
import { DictRadio } from '../Dict';
import type { FormDictRadioProps } from './typings';

function LtFormDictRadio<V = any>(props: FormDictRadioProps<V>) {
  const { name, label, code, formItemProps, dictProps } = props;

  return (
    <Form.Item {...formItemProps} name={name} label={label}>
      <DictRadio {...dictProps} code={code} />
    </Form.Item>
  );
}

export default LtFormDictRadio;
