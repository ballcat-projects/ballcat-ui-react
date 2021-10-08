import { DictCheckbox } from '../../Dict';
import type { FormDictCheckboxProps } from '../typings';
import LtFormDict from './LtFormDict';
import type { DictCheckboxProps } from '@/components/Dict';

function LtFormDictCheckbox<V = any>(props: FormDictCheckboxProps<V>) {
  return <LtFormDict<DictCheckboxProps, V> {...props} Component={DictCheckbox} />;
}

export default LtFormDictCheckbox;
