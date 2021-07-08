import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import { message, notification } from 'antd';
import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import { history, Link, useIntl } from 'umi';
import type { RequestInterceptor, ResponseError, ResponseInterceptor } from 'umi-request';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  user?: GLOBAL.UserInfo;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      return await queryCurrentUser();
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果是登录页面，不执行
  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: {},
    };
  }
  return {
    fetchUserInfo,
    settings: {},
  };
}

/**
 * 自定义拦截请求
 */
const customerRequestInterceptor: RequestInterceptor = (url, options) => {
  // 处理请求地址
  const newUrl = `/api/${url.startsWith('/') ? url.substring(1) : url}`;
  const headers: any = { ...options.headers };

  // 添加token
  const token = localStorage.getItem('access-key');
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
      if (json && json.code !== 200) {
        // 登录接口, 通过是否存在token判断成功或失败
        if (option.url === 'oauth/token' && json.access_token) {
          return response;
        }

        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw {
          response,
          data: json,
          message: json.message,
        };
      }

      message.success(
        useIntl().formatMessage({
          id: 'global.operate.complete',
          defaultMessage: 'success',
        }),
      );
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

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    links: isDev
      ? [
          <Link to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>openAPI 文档</span>
          </Link>,
          <Link to="/~docs">
            <BookOutlined />
            <span>业务组件文档</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    ...initialState?.settings,
  };
};
