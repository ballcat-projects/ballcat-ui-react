import { request } from 'umi';

/**
 * 获取验证码
 */
export async function captchaGet(body: any) {
  return request<any>('captcha/tianai/gen', {
    method: 'GET',
    params: body,
  });
}

/**
 * 校验
 */
export async function captchaValid(params: any, body: any) {
  return request<any>('captcha/tianai/check', {
    method: 'POST',
    params,
    data: body,
  });
}
