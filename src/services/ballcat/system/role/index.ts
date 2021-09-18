import type { PageResult, QueryParam, R, SelectData } from '@/typings';
import { request } from 'umi';
import type { SysRole, SysRoleQo, SysRoleVo } from '../';
import type { SysRoleBindQo, SysRoleBindVo } from './typings';

export async function query(body: QueryParam<SysRoleQo>) {
  return request<R<PageResult<SysRoleVo>>>('system/role/page', {
    method: 'GET',
    params: body,
  });
}

export async function create(body: SysRole) {
  return request<R<any>>('system/role', {
    method: 'POST',
    data: body,
  });
}

export async function edit(body: SysRole) {
  return request<R<any>>('system/role', {
    method: 'PUT',
    data: body,
  });
}

export async function del(body: SysRoleVo) {
  return request<R<any>>(`system/role/${body.id}`, {
    method: 'DELETE',
  });
}

export async function getById(id: number) {
  return request<R<SysRole>>(`system/role/${id}`, { method: 'GET' });
}

export async function listRoles() {
  return request<R<SysRole>>(`system/role/list`, { method: 'GET' });
}

export async function updatePermissionIds(roleCode: string, permissionIds: number[]) {
  return request<R<boolean>>(`system/role/permission/code/${roleCode}`, {
    method: 'PUT',
    data: permissionIds,
  });
}

export async function getPermissionIds(roleCode: string) {
  return request<R<number[]>>(`system/role/permission/code/${roleCode}`, { method: 'GET' });
}

export async function listSelectData() {
  return request<R<SelectData<SysRole>[]>>(`system/role/select`, { method: 'GET' });
}

export async function listRoleBindUser(body: QueryParam<SysRoleBindQo>) {
  return request<R<PageResult<SysRoleBindVo>>>('system/role/user/page', {
    method: 'GET',
    params: body,
  });
}

export async function unbindUser(userId: number, roleCode: string) {
  return request<R<any>>(`system/role/user`, {
    method: 'DELETE',
    params: {
      userId,
      roleCode,
    },
  });
}
