import { PageLoading } from '@ant-design/pro-layout';
import type { RequestConfig } from 'umi';
import type { GLOBAL } from '@/typings';
import { LayoutSetting, User } from '@/utils/Ballcat';
import { settings } from '@/utils/ConfigUtils';
import ProjectRequestConfig from '@/utils/RequestConfig';
import { AliveScope } from 'react-activation';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<GLOBAL.Is> {
  const is: GLOBAL.Is = {
    settings: { ...settings, ...LayoutSetting.get() },
  };
  const cache = User.get();

  if (cache) {
    is.user = cache ? JSON.parse(cache) : {};
  }

  return { ...is };
}

export function rootContainer(container: any) {
  return <AliveScope>{container}</AliveScope>;
}

/**
 * 请求增强
 * @see https://beta-pro.ant.design/docs/request-cn
 */
export const request: RequestConfig = { ...ProjectRequestConfig };
