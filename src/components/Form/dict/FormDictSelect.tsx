import type { DictSelectProps } from '../../Dict';
import { DictSelect } from '../../Dict';
import type { FormDictSelectProps } from '../typings';
import FormDict from './FormDict';

function FormDictSelect<V = any>(props: FormDictSelectProps<V>) {
  return <FormDict<DictSelectProps, V> {...props} Component={DictSelect} />;
}

export default FormDictSelect;
