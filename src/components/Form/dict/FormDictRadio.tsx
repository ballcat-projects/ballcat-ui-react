import { DictRadio } from '../../Dict';
import type { FormDictRadioProps } from '../typings';
import FormDict from './FormDict';
import type { DictRadioProps } from '@/components/Dict';

function FormDictRadio<V = any>(props: FormDictRadioProps<V>) {
  return <FormDict<DictRadioProps, V> {...props} Component={DictRadio} />;
}

export default FormDictRadio;
