import type { R } from '@/typings';
import { request } from 'umi';
import type { SysMenuRoleGrateVo } from '..';
import type { SysMenuDto, SysMenuQo, SysMenuVo } from './typings';

export async function query(body: Partial<SysMenuQo>) {
  return request<R<SysMenuVo[]>>('system/menu/list', {
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

export async function listRoleGrant() {
  return request<R<SysMenuRoleGrateVo>>(`system/menu/grant-list`, { method: 'GET' });
}
