import type { PageResult, QueryParam, R } from '@/typings';
import { request } from 'umi';
import type { SysConfig, SysConfigQo, SysConfigVo } from './typings';

export async function query(body: QueryParam<SysConfigQo>) {
  return request<R<PageResult<SysConfigVo>>>('system/config/page', {
    method: 'GET',
    params: body,
  });
}

export async function create(body: SysConfig) {
  return request<R<any>>('system/config', {
    method: 'POST',
    data: body,
  });
}

export async function edit(body: SysConfig) {
  return request<R<any>>('system/config', {
    method: 'PUT',
    data: body,
  });
}

export async function del(body: SysConfigVo) {
  return request<R<any>>(`system/config`, {
    method: 'DELETE',
    params: { confKey: body.confKey },
  });
}
