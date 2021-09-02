import type { PageResult, QueryParam, R } from '@/typings';
import { request } from 'umi';
import type { SysDict, SysDictQo, SysDictVo } from './typing';

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
