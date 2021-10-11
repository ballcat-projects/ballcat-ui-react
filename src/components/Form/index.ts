import ModalForm from './ModalForm';
import FormDictRadio from './dict/FormDictRadio';
import FormDictSelect from './dict/FormDictSelect';
import FormNumber from './FormNumber';
import FormGroup from './FormGroup';
import FormDictCheckbox from './dict/FormDictCheckbox';

export * from './typings';

const Form = {
  Modal: ModalForm,
  DictRadio: FormDictRadio,
  DictSelect: FormDictSelect,
  Number: FormNumber,
  Group: FormGroup,
  DictCheckbox: FormDictCheckbox,
};

export default Form;

export { ModalForm, FormDictRadio, FormDictSelect, FormNumber };
