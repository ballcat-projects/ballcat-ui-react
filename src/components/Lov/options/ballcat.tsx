import type { LovConfig } from '@/components/Lov';
import type { SysUserVo } from '@/services/ballcat/system';
import { query } from '@/services/ballcat/system/user';

export const LovUserMultiple: LovConfig<number, SysUserVo> = {
  title: '用户',
  uniqueKey: 'userId',
  multiple: true,
  request: query,
  isRet: true,
  ret: 'userId',
  columns: [
    {
      title: '用户名',
      dataIndex: 'username',
      copy: true,
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      ellipsis: true,
    },
    {
      title: '组织',
      dataIndex: 'organizationName',
    },
  ],
  searchArray: [
    {
      label: '用户名',
      field: 'username',
      html: 'input',
    },
    {
      label: '昵称',
      field: 'nickname',
      html: 'input',
    },
  ],
};
