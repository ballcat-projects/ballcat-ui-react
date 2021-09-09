import I18n from '@/utils/I18nUtils';
import { InputNumber } from 'antd';
import LtFormItem from './LtFormItem';
import type { FormNumberProps } from './typings';

function LtFormNumber<V = any>(props: FormNumberProps<V>) {
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
    <LtFormItem<V> {...props}>
      <InputNumber<number> {...numberProps} />
    </LtFormItem>
  );
}

export default LtFormNumber;
