import type { PageResult, QueryParam, R } from '@/typings';
import { request } from 'umi';
import type { SysDictItem, SysDictItemQo, SysDictItemVo } from './typing';

export async function query(body: QueryParam<SysDictItemQo>) {
  return request<R<PageResult<SysDictItemVo>>>('system/dict/item/page', {
    method: 'GET',
    params: body,
  });
}

export async function create(body: SysDictItem) {
  return request<R<any>>('system/dict/item', {
    method: 'POST',
    data: body,
  });
}

export async function edit(body: SysDictItem) {
  return request<R<any>>('system/dict/item', {
    method: 'PUT',
    data: body,
  });
}

export async function del(body: SysDictItem) {
  return request<R<any>>(`system/dict/item/${body.id}`, {
    method: 'DELETE',
  });
}

export async function updateStatus(id: number, status: number) {
  return request<R<void>>(`/system/dict/item/${id}?status=${status}`, {
    method: 'patch',
  });
}
