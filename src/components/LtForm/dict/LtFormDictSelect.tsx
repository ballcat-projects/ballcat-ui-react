import type { DictSelectProps } from '../../Dict';
import { DictSelect } from '../../Dict';
import type { FormDictSelectProps } from '../typings';
import LtFormDict from './LtFormDict';

function LtFormDictSelect<V = any>(props: FormDictSelectProps<V>) {
  return <LtFormDict<DictSelectProps, V> {...props} Component={DictSelect} />;
}

export default LtFormDictSelect;
