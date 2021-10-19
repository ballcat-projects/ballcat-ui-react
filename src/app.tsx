import { PageLoading } from '@ant-design/pro-layout';
import { notification } from 'antd';
import type { RequestConfig } from 'umi';
import { dynamic } from 'umi';
import type { RequestInterceptor, ResponseError, ResponseInterceptor } from 'umi-request';
import { getMenu } from '@/utils/RouteUtils';
import type { GLOBAL } from '@/typings';
import LoadingComponent from '@ant-design/pro-layout/es/PageLoading';
import { User, Token, Dict, LayoutSetting } from '@/utils/Ballcat';
import type { SysDictData, SysDictDataHash } from '@/services/ballcat/system';
import { dict } from '@/services/ballcat/system';
import I18n from './utils/I18nUtils';
import Notify from './utils/NotifyUtils';

// const isDev = process.env.NODE_ENV === 'development';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<GLOBAL.Is> {
  const is: GLOBAL.Is = {
    settings: LayoutSetting.get(),
    menuFirst: '/',
  };
  const menuArray: any[] = [];
  let dictHashs: SysDictDataHash = {};
  const dictCache: Record<string, SysDictData> = {};

  is.menuArray = menuArray;
  const cache = User.get();

  if (cache) {
    // 菜单
    const menus = await getMenu();
    menuArray.push(...menus);
    // 无效字典删除
    dictHashs = Dict.getHashs();
    // 校验hash是否过期
    const expireHashs = (await dict.validHash(dictHashs)).data;
    expireHashs.forEach((code) => {
      // 删除过期hash
      delete dictHashs[code];
      Dict.del(code);
    });

    // 字典数据加载
    Object.keys(dictHashs).forEach((code) => {
      const data = Dict.get(code);
      if (data) {
        dictCache[code] = Dict.toInitialStateData(data);
      }
    });

    is.user = cache ? JSON.parse(cache) : {};

    menuArray.push({
      component: dynamic({
        loader: () => import('@/pages/exception/404'),
        loading: LoadingComponent,
      }),
    });
  }

  return { ...is, dict: { hashs: dictHashs, cache: dictCache } };
}

/**
 * 自定义拦截请求
 */
const customerRequestInterceptor: RequestInterceptor = (url, options) => {
  // 处理请求地址
  const newUrl = `/api/${url.startsWith('/') ? url.substring(1) : url}`;
  const headers: any = { ...options.headers };

  // 添加token
  const token = Token.get();
  if (!headers.Authorization && token) {
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
            if (option.url === 'captcha/get' || option.url === 'captcha/check') {
              return response;
            }
          }

          if (response.status === 401) {
            // token 鉴权异常
            Token.clean();
            User.clean();
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
