import { DictRadio } from '../../Dict';
import type { FormDictRadioProps } from '../typings';
import LtFormDict from './LtFormDict';
import type { DictRadioProps } from '@/components/Dict';

function LtFormDictRadio<V = any>(props: FormDictRadioProps<V>) {
  return <LtFormDict<DictRadioProps, V> {...props} Component={DictRadio} />;
}

export default LtFormDictRadio;
