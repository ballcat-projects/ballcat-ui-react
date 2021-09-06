import { DictRadio } from '../Dict';
import LtFormItem from './LtFormItem';
import type { FormDictRadioProps } from './typings';

function LtFormDictRadio<V = any>(props: FormDictRadioProps<V>) {
  const { code, dictProps } = props;

  return (
    <LtFormItem<V> {...props}>
      <DictRadio {...dictProps} code={code} />
    </LtFormItem>
  );
}

export default LtFormDictRadio;
