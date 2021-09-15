import type { PageResult, QueryParam, R } from '@/typings';
import { request } from 'umi';
import type { SysOrganizationVo, SysOrganizationQo, SysOrganizationDto } from './typings';

export async function query(body: QueryParam<SysOrganizationQo>) {
  return request<R<PageResult<SysOrganizationVo>>>('system/organization/tree', {
    method: 'GET',
    params: body,
  });
}

export async function create(body: SysOrganizationDto) {
  return request<R<any>>('system/organization', {
    method: 'POST',
    data: body,
  });
}

export async function edit(body: SysOrganizationDto) {
  return request<R<any>>('system/organization', {
    method: 'PUT',
    data: body,
  });
}

export async function del(body: SysOrganizationVo) {
  return request<R<any>>(`system/organization/${body.id}`, {
    method: 'DELETE',
  });
}

export function revised() {
  return request('/system/organization/revised', {
    method: 'patch',
  });
}
