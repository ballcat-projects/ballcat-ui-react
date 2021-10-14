import ModalForm from './ModalForm';
import FormDictRadio from './dict/FormDictRadio';
import FormDictSelect from './dict/FormDictSelect';
import FormNumber from './FormNumber';
import FormGroup from './FormGroup';
import FormDictCheckbox from './dict/FormDictCheckbox';
import I18n from '@/utils/I18nUtils';

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

const defautlTitle = {
  read: I18n.text('form.read'),
  edit: I18n.text('form.edit'),
  create: I18n.text('form.create'),
  del: I18n.text('form.del'),
};
export { ModalForm, FormDictRadio, FormDictSelect, FormNumber, defautlTitle };
