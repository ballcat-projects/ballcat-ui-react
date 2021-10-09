import { LovConfig } from '@/components/Lov';
import { SysUserVo } from '@/services/ballcat/system';

export const LovUserMultiple: LovConfig<SysUserVo> = {
  keyword: 'ballcat_user_multiple',
  title: '用户',
  uniqueKey: 'userId',
  multiple: true,
  url: 'system/user/page',
  method: 'GET',
  position: 'PARAMS',
  isRet: true,
  ret: 'userId',
  columns: [
    {
      title: '用户名',
      field: 'username',
      copy: true,
    },
    {
      title: '昵称',
      field: 'nickname',
      ellipsis: true,
    },
    {
      title: '组织',
      field: 'organizationName',
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
