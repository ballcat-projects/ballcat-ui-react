import type { IntlShape } from 'react-intl';
import { message } from 'antd';
import type { ConfigOnClose, MessageType } from 'antd/lib/message';

let intl: IntlShape;
const I18n = {
  setIntl: (it: IntlShape) => {
    intl = it;
  },
  getIntl: () => intl,
  text: (key: string, defaultMessage = key) => {
    return I18n.getIntl().formatMessage({ id: key, defaultMessage });
  },
  info: (key: string, duration?: number | (() => void), onClose?: ConfigOnClose): MessageType => {
    return message.info(I18n.text(key), duration, onClose);
  },
  success: (
    key: string,
    duration?: number | (() => void),
    onClose?: ConfigOnClose,
  ): MessageType => {
    return message.success(I18n.text(key), duration, onClose);
  },
  error: (key: string, duration?: number | (() => void), onClose?: ConfigOnClose): MessageType => {
    return message.error(I18n.text(key), duration, onClose);
  },
  warning: (
    key: string,
    duration?: number | (() => void),
    onClose?: ConfigOnClose,
  ): MessageType => {
    return message.warning(I18n.text(key), duration, onClose);
  },
  loading: (
    key: string,
    duration?: number | (() => void),
    onClose?: ConfigOnClose,
  ): MessageType => {
    return message.loading(I18n.text(key), duration, onClose);
  },
};

export default I18n;
