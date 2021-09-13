import type { R } from '@/typings';
import { request } from 'umi';
import type { SysI18n, SysI18nListVo } from './typings';

export function listByCode(code: string) {
  return request<R<SysI18nListVo[]>>(`i18n/i18n-data/list?code=${code}`, { method: 'GET' });
}

export function edit(body: SysI18n) {
  return request<R<any>>('i18n/i18n-data', { method: 'PUT', data: body });
}
