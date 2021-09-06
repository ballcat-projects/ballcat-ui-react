import { DictSelect } from '../Dict';
import LtFormItem from './LtFormItem';
import type { FormDictSelectProps } from './typings';

function LtFormDictSelect<V = any>(props: FormDictSelectProps<V>) {
  const { code, dictProps } = props;

  return (
    <LtFormItem<V> {...props}>
      <DictSelect {...dictProps} code={code} />
    </LtFormItem>
  );
}

export default LtFormDictSelect;
