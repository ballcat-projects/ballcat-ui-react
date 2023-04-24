import { request } from 'umi';
import type { GLOBAL, R } from '@/typings';
import type { LoginParams } from './typings';
import { Token } from '@/utils/Ballcat';

export * from './typings';

/**
 * 退出登录接口
 */
export async function logout() {
  const token = Token.get();
  return request<any>('oauth2/revoke', {
    method: 'POST',
    headers: {
      Authorization: 'Basic dWk6dWk=',
    },
    params: { token: token },
  });
}

/**
 * 登录接口
 */
export async function login(body: LoginParams) {
  return request<GLOBAL.UserInfo>('oauth2/token', {
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
