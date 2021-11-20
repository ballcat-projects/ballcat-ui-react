import { request } from 'umi';
import type { GLOBAL, R } from '@/typings';
import type { LoginParams } from './typings';

export * from './typings';

/**
 * 退出登录接口
 */
export async function logout() {
  return request<any>('oauth/logout', {
    method: 'DELETE',
  });
}

/**
 * 登录接口
 */
export async function login(body: LoginParams) {
  return request<GLOBAL.UserInfo>('oauth/token', {
    method: 'POST',
    headers: {
      Authorization: 'Basic dWk6dWk=',
    },
    params: { ...body, grant_type: 'password' },
  });
}

/**
 * 获取路由
 */
export async function router() {
  return request<R<GLOBAL.Router[]>>('system/menu/router', {
    method: 'GET',
  });
}
