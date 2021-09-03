import type { PageResult, QueryParam, R } from '@/typings';
import { request } from 'umi';
import type { SysDict, SysDictData, SysDictDataHash, SysDictQo, SysDictVo } from './typing';

export async function query(body: QueryParam<SysDictQo>) {
  return request<R<PageResult<SysDictVo>>>('system/dict/page', {
    method: 'GET',
    params: body,
  });
}

export async function create(body: SysDict) {
  return request<R<any>>('system/dict', {
    method: 'POST',
    data: body,
  });
}

export async function edit(body: SysDict) {
  return request<R<any>>('system/dict', {
    method: 'PUT',
    data: body,
  });
}

export async function del(body: SysDict) {
  return request<R<any>>(`system/dict/${body.id}`, {
    method: 'DELETE',
  });
}

export async function validHash(body: SysDictDataHash) {
  return request<R<string[]>>('system/dict/invalid-hash', {
    method: 'POST',
    data: body,
  });
}

export async function dictData(body: string[]) {
  return request<R<SysDictData[]>>(`/system/dict/data?dictCodes=${body.join(',')}`, {
    method: 'GET',
  });
}
