import { request } from 'umi';

/**
 * 获取验证码
 */
export async function get(body: CAPTCHA.GetParams) {
  return request<CAPTCHA.Info>('captcha/get', {
    method: 'POST',
    data: body,
  });
}

/**
 * 校验
 */
export async function valid(body: CAPTCHA.ValidParams) {
  return request<CAPTCHA.ValidRes>('captcha/check', {
    method: 'POST',
    data: body,
  });
}
