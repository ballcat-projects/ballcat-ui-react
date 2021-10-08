import ModalForm from './LtModalForm';
import LtFormDictRadio from './dict/LtFormDictRadio';
import LtFormDictSelect from './dict/LtFormDictSelect';
import LtFormNumber from './LtFormNumber';
import LtFormGroup from './LtFormGroup';
import LtFormDictCheckbox from './dict/LtFormDictCheckbox';

export * from './typings';

const LtForm = {
  Modal: ModalForm,
  DictRadio: LtFormDictRadio,
  DictSelect: LtFormDictSelect,
  Number: LtFormNumber,
  Group: LtFormGroup,
  DictCheckbox: LtFormDictCheckbox,
};

export default LtForm;

export { ModalForm, LtFormDictRadio, LtFormDictSelect, LtFormNumber };
