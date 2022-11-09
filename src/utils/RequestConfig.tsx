import { Token, isLogin } from '@/utils/Ballcat';
import I18n from '@/utils/I18nUtils';
import Notify from '@/utils/NotifyUtils';
import { notification } from 'antd';
import type { RequestConfig } from 'umi';
import type { RequestInterceptor, ResponseError, ResponseInterceptor } from 'umi-request';

/**
 * 自定义拦截请求
 */
const customerRequestInterceptor: RequestInterceptor = (url, options) => {
  // 处理请求地址
  const newUrl = `/api/${url.startsWith('/') ? url.substring(1) : url}`;
  const headers: any = { ...options.headers };

  // 添加token
  const token = Token.get();
  if (!headers.Authorization && token && isLogin()) {
    headers.Authorization = `Bearer ${token}`;
  }

  // 添加语言
  if (!headers['Accept-Language']) {
    headers['Accept-Language'] = I18n.getLocal();
  }

  return { url: newUrl, options: { ...options, headers } };
};

/**
 * 自定义处理返回值
 */
const customerResponseInterceptor: ResponseInterceptor = async (res, option) => {
  // 返回值不是json
  let isJson = false;

  res.headers.forEach((v, k) => {
    if (k.toLowerCase() === 'content-type') {
      if (v.indexOf('application/json') !== -1) {
        isJson = true;
      }
    }
  });

  // 仅处理json数据
  return !isJson
    ? res
    : res
        .clone()
        .json()
        .then((json) => {
          const response = res;

          if (option.url) {
            // 部分接口特殊处理
            if (option.url.startsWith('captcha/')) {
              return response;
            }
          }

          if (response.status === 401) {
            // token 鉴权异常
            Notify.logout();
            // eslint-disable-next-line @typescript-eslint/no-throw-literal
            throw {
              response,
              data: json,
              message: json.message || json.error,
            };
          }

          if (json && json.code !== 200) {
            // 登录接口, 通过是否存在token判断成功或失败
            if (option.url === 'oauth/token' && json.access_token) {
              return response;
            }

            // eslint-disable-next-line @typescript-eslint/no-throw-literal
            throw {
              response,
              data: json,
              message: json.message || json.error,
            };
          }

          return response;
        });
};

const errorHandler = (error: ResponseError) => {
  const { response, message: msg } = error;
  // 401 不弹通知
  if (response.status === 401) {
    return;
  }

  if (!response) {
    notification.error({
      description: I18n.text('app.error.network.description'),
      message: I18n.text('app.error.network'),
    });
  } else {
    notification.error({
      description: (
        <>
          {response.status === 401 ? (
            <>
              {I18n.text('app.error.permissions.description')}
              <br />
            </>
          ) : undefined}
          {msg}
        </>
      ),
      message: I18n.text(
        response.status === 401 ? 'app.error.permissions' : 'global.operation.failed',
      ),
    });
  }
  throw error;
};

const request: RequestConfig = {
  requestType: 'json',
  requestInterceptors: [customerRequestInterceptor],
  responseInterceptors: [customerResponseInterceptor],
  errorConfig: {
    adaptor: () => {
      return { success: true };
    },
  },
  errorHandler,
};

export default request;
