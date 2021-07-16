import { request } from 'umi';
import type { SysUserQo, SysUserVo } from '@/services/ballcat/system/typing';
import type { PageResult, QueryParam, R } from '@/typings';

/**
 * 获取验证码
 */
export async function query(body: QueryParam<SysUserQo>) {
  return request<R<PageResult<SysUserVo>>>('system/user/page', {
    method: 'GET',
    data: body,
  });
}
