import type { PageResult, QueryParam, R } from '@/typings';
import { request } from 'umi';
import type { SysMenuDto, SysMenuQo, SysMenuVo } from './typings';

export async function query(body: QueryParam<SysMenuQo>) {
  return request<R<PageResult<SysMenuVo>>>('system/menu/list', {
    method: 'GET',
    params: body,
  });
}

export async function create(body: SysMenuDto) {
  return request<R<any>>('system/menu', {
    method: 'POST',
    data: body,
  });
}

export async function edit(body: SysMenuDto) {
  return request<R<any>>('system/menu', {
    method: 'PUT',
    data: body,
  });
}

export async function del(body: SysMenuVo) {
  return request<R<any>>(`system/menu/${body.id}`, {
    method: 'DELETE',
  });
}
