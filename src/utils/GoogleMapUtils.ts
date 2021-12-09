import { settings } from '@/utils/ConfigUtils';
import I18n from '@/utils/I18nUtils';

const GoogleMapUtils = {
  getKey: () => settings.key?.google?.map as string,
  getLang: () => {
    const local = I18n.getLocal();

    if (local === 'en-US') {
      return 'en';
    }

    return local;
  },
};

export default GoogleMapUtils;
