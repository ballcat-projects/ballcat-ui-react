import { PageLoading } from '@ant-design/pro-layout';
import { message, notification } from 'antd';
import type { RequestConfig } from 'umi';
import { history, useIntl } from 'umi';
import type { RequestInterceptor, ResponseError, ResponseInterceptor } from 'umi-request';
import { getMenu } from '@/utils/RouteUtils';
import type { GLOBAL } from '@/typings';

// const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<GLOBAL.Is> {
  const is: GLOBAL.Is = {
    settings: {},
  };
  const menuArray: any[] = [];

  is.menuArray = menuArray;
  // 如果是登录页面，不执行
  if (history.location.pathname !== loginPath) {
    // await updateRouter();
    const cache = localStorage.getItem('ballcat_user');

    if (cache) {
      const menus = await getMenu();
      menuArray.push(...menus);
    } else {
      history.push('/user/login');
    }

    is.user = cache ? JSON.parse(cache) : {};
  }
  return is;
}

/**
 * 自定义拦截请求
 */
const customerRequestInterceptor: RequestInterceptor = (url, options) => {
  // 处理请求地址
  const newUrl = `/api/${url.startsWith('/') ? url.substring(1) : url}`;
  const headers: any = { ...options.headers };

  // 添加token
  const token = localStorage.getItem('access-token');
  if (!headers.Authorization && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return { url: newUrl, options: { ...options, headers } };
};

/**
 * 自定义处理返回值
 */
const customerResponseInterceptor: ResponseInterceptor = (res, option) => {
  return res
    .clone()
    .json()
    .then((json) => {
      const response = res;

      if (option.url) {
        // 部分接口特殊处理
        if (option.url === 'captcha/get' || option.url === 'captcha/check') {
          return response;
        }
      }

      if (response.status === 401) {
        // token 鉴权异常
        localStorage.removeItem('ballcat_user');
        localStorage.removeItem('access-token');
        window.location.reload();
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

      if (option.url !== 'system/menu/router') {
        message.success(
          useIntl().formatMessage({
            id: 'global.operate.complete',
            defaultMessage: 'success',
          }),
        );
      }
      return response;
    });
};
const errorHandler = (error: ResponseError) => {
  const { response, message: msg } = error;
  if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  } else {
    notification.error({
      description: msg,
      message: '操作异常',
    });
  }
  throw error;
};

/**
 * 请求增强
 * @see https://beta-pro.ant.design/docs/request-cn
 */
export const request: RequestConfig = {
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
