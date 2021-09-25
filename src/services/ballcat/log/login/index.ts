import type { PageResult, QueryParam, R } from '@/typings';
import { request } from 'umi';
import type { LoginLogQo, LoginLogVo } from './typings';

export async function query(body: QueryParam<LoginLogQo>) {
  return request<R<PageResult<LoginLogVo>>>('log/login-log/page', {
    method: 'GET',
    params: body,
  });
}
