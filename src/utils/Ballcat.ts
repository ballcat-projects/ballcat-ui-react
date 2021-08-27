export const token_key = 'access-token';
export const user_key = 'ballcat_user';

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
