import type { SysDictData, SysDictDataHash, SysDictDataItem } from '@/services/ballcat/system';
import type { GLOBAL } from '@/typings';
import type { ProjectSetting } from '@/config/ProjectConfig';
import settings from '@/config/ProjectConfig';
import { history } from 'umi';

export const token_key = 'access-token';
export const user_key = 'user';
export const dict_data_key = 'dict_data';
export const dict_hash_key = 'dict_hash';
export const layout_setting_key = 'layout_setting';
export const login_uri = '/user/login';

export function getKey(key: string): string {
  return `${settings.storageOptions?.namespace}${key}`;
}

export function get(key: string): string | null {
  return localStorage.getItem(getKey(key));
}

export function set(key: string, val: any): void {
  localStorage.setItem(getKey(key), val);
}

export function remove(key: string): void {
  localStorage.removeItem(getKey(key));
}

export const Token = {
  get: () => {
    return get(token_key);
  },
  set: (val: any) => {
    set(token_key, val);
  },
  clean: () => {
    remove(token_key);
  },
};

export const User = {
  get: () => {
    return get(user_key);
  },
  set: (val: any) => {
    set(user_key, val);
  },
  clean: () => {
    remove(user_key);
  },
};

export const Dict = {
  getHashs: (): SysDictDataHash => {
    const hashs = get(dict_hash_key);

    return hashs ? JSON.parse(hashs) : {};
  },
  setHashs: (hashs: SysDictDataHash) => {
    set(dict_hash_key, JSON.stringify(hashs));
  },
  getKey: (code: string) => {
    return `${dict_data_key}_${code}`;
  },
  get: (code: string): SysDictData | undefined => {
    const cache = get(Dict.getKey(code));
    if (cache) {
      return JSON.parse(cache);
    }
    return undefined;
  },
  set: (data: SysDictData) => {
    set(Dict.getKey(data.dictCode), JSON.stringify(data));
  },
  del: (code: string) => {
    remove(Dict.getKey(code));
  },
  toData: (data: SysDictData) => {
    const items: SysDictDataItem[] = [];

    (data.dictItems || []).forEach((item) => {
      items.push({ ...item, realVal: Dict.getRealValue(data.valueType, item.value) });
    });

    return { ...data, dictItems: items };
  },
  getRealValue: (type: 1 | 2 | 3 | undefined, val: string): any => {
    switch (type) {
      case 3:
        // 布尔值处理
        if (val && (val.toLowerCase() === 'false' || val === '0')) {
          return false;
        }
        return Boolean(val);
      case 2:
        // 字符串
        return String(val);
      default:
        // 数字
        return Number(val);
    }
  },
};

export const LayoutSetting = {
  get: (): ProjectSetting => {
    const ls = get(layout_setting_key);
    if (ls) {
      return JSON.parse(ls);
    }
    return { ...settings };
  },
  set: (ps: Partial<ProjectSetting>) => {
    set(layout_setting_key, JSON.stringify(ps));
  },
};

/**
 * 判断当前是否已登录
 * @param initialState  全局上下文内容
 */
export function isLogin(initialState?: GLOBAL.Is) {
  // 当前在登录页, 未登录
  if (history && history.location.pathname === login_uri) {
    return false;
  }

  if (!initialState || !initialState?.user) {
    return !!Token.get();
  }

  // 存在token 已登录
  return !!initialState?.user?.access_token && !!Token.get();
}
