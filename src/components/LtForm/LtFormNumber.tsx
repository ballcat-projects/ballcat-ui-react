import { InputNumber } from 'antd';
import LtFormItem from './LtFormItem';
import type { FormNumberProps } from './typings';

function LtFormNumber<V = any>(props: FormNumberProps<V>) {
  const { inputProps } = props;

  return (
    <LtFormItem<V> {...props}>
      <InputNumber<number> style={{ width: '100%' }} {...inputProps} />
    </LtFormItem>
  );
}

export default LtFormNumber;
