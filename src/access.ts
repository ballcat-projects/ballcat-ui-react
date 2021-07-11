/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 */
import type { MenuDataItem } from '@ant-design/pro-layout';
import type { GLOBAL } from '@/typings';

export default function access(initialState: {
  menuArray: MenuDataItem[];
  user?: GLOBAL.UserInfo;
}) {
  const { menuArray } = initialState || {};

  return {
    canAdmin: menuArray,
  };
}
