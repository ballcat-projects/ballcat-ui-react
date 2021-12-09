import I18n from '@/utils/I18nUtils';

const GoogleMapUtils = {
  getKey: () => process.env.google_map_api as string,
  getLang: () => {
    const local = I18n.getLocal();

    if (local === 'en-US') {
      return 'en';
    }

    return local;
  },
};

export default GoogleMapUtils;
