import { InputNumber } from 'antd';
import LtFormItem from './LtFormItem';
import type { FormNumberProps } from './typings';

function LtFormNumber<V = any>(props: FormNumberProps<V>) {
  const {
    name,
    label,
    initialValue,
    formItemProps,
    tooltip,
    style,
    inputProps,
    placeholder,
    min,
    max,
  } = props;

  const formProps = {
    name,
    label,
    initialValue,
    formItemProps,
    tooltip,
    style,
  };

  const numberProps = { style: { width: '100%' }, ...inputProps, placeholder, min, max };

  return (
    <LtFormItem<V> {...formProps}>
      <InputNumber<number> {...numberProps} />
    </LtFormItem>
  );
}

export default LtFormNumber;
