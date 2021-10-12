// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { GLOBAL, R } from '@/typings';

/** 退出登录接口 POST oauth/logout */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('oauth/logout', {
    method: 'DELETE',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  body.grant_type = 'password';

  return request<GLOBAL.UserInfo>('oauth/token', {
    method: 'POST',
    headers: {
      Authorization: 'Basic dWk6dWk=',
    },
    params: body,
    ...(options || {}),
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

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}
