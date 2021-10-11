import I18n from '@/utils/I18nUtils';
import { InputNumber } from 'antd';
import FormItem from './FormItem';
import type { FormNumberProps } from './typings';

function FormNumber<V = any>(props: FormNumberProps<V>) {
  const {
    label,
    inputProps,
    placeholder = label && typeof label === 'string'
      ? I18n.text('form.placeholder', { label })
      : undefined,
    min,
    max,
  } = props;

  const numberProps = { style: { width: '100%' }, ...inputProps, placeholder, min, max };

  return (
    <FormItem<V> {...props}>
      <InputNumber<number> {...numberProps} />
    </FormItem>
  );
}

export default FormNumber;
