import { DictCheckbox } from '../../Dict';
import type { FormDictCheckboxProps } from '../typings';
import FormDict from './FormDict';
import type { DictCheckboxProps } from '@/components/Dict';

function FormDictCheckbox<V = any>(props: FormDictCheckboxProps<V>) {
  return <FormDict<DictCheckboxProps, V> {...props} Component={DictCheckbox} />;
}

export default FormDictCheckbox;
