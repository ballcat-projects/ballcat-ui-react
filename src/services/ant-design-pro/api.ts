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

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'DELETE',
    ...(options || {}),
  });
}
