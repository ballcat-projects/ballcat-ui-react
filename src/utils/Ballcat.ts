import type { SysDictData, SysDictDataHash } from '@/services/ballcat/system';

export const token_key = 'access-token';
export const user_key = 'ballcat_user';
export const dict_data_key = 'dict_data';
export const dict_hash_key = 'dict_hash';

export function get(key: string): string | null {
  return localStorage.getItem(key);
}

export function set(key: string, val: any): void {
  localStorage.setItem(key, val);
}

export function remove(key: string): void {
  localStorage.removeItem(key);
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
    const hashs = Dict.getHashs();
    hashs[data.dictCode] = data.hashCode;
    Dict.setHashs(hashs);
  },
  del: (code: string) => {
    remove(Dict.getKey(code));
  },
};
