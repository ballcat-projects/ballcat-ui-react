import type { PageResult, QueryParam, R } from '@/typings';
import { request } from 'umi';
import type { SysI18nQo, SysI18nVo } from '..';
import type { SysI18nDto, SysI18nListVo } from './typings';

export function listByCode(code: string) {
  return request<R<SysI18nListVo[]>>(`i18n/i18n-data/list?code=${code}`, { method: 'GET' });
}

export async function query(body: QueryParam<SysI18nQo>) {
  return request<R<PageResult<SysI18nVo>>>('i18n/i18n-data/page', {
    method: 'GET',
    params: body,
  });
}

export async function create(body: SysI18nDto) {
  return request<R<any>>('i18n/i18n-data', {
    method: 'POST',
    data: body,
  });
}

export function edit(body: SysI18nDto) {
  return request<R<any>>('i18n/i18n-data', { method: 'PUT', data: body });
}

export async function del(body: SysI18nVo) {
  return request<R<any>>(`i18n/i18n-data`, {
    method: 'DELETE',
    params: {
      code: body.code,
      languageTag: body.languageTag,
    },
  });
}

export function exportExcel(body: SysI18nQo) {
  return request<Blob>(`i18n/i18n-data/export`, {
    method: 'GET',
    params: body,
    responseType: 'blob',
  });
}

export function downloadTemplate() {
  return request<Blob>(`i18n/i18n-data/excel-template`, {
    method: 'GET',
    responseType: 'blob',
  });
}

export function importExcel(fd: FormData) {
  return request(`i18n/i18n-data/import`, {
    method: 'POST',
    body: fd,
  });
}
