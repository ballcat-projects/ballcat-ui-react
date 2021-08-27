import { Input, Tag } from 'antd';
import { LovConfig } from '@/components/Lov';
import { SysUserVo } from '@/services/ballcat/system';

export const LovDemoMultiple: LovConfig<SysUserVo> = {
  title: '用户',
  keyword: 'lov_demo_multiple',
  uniqueKey: 'userId',
  url: '/system/user/page',
  method: 'GET',
  position: 'PARAMS',
  fixedParams: {},
  multiple: true,
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
      render: (val) => <Tag>{val}</Tag>,
    },
  ],
  searchArray: [
    {
      label: 'ID',
      field: 'userId',
      html: 'input-number',
    },
    {
      label: '用户名',
      field: 'username',
      html: 'input',
    },
    {
      label: '搜索的昵称',
      field: 'nickname',
      html: (setVal) => {
        return <Input addonBefore={'test'} onChange={(e) => setVal(e.target.value)} />;
      },
    },
  ],
};

export const LovDemo: LovConfig<SysUserVo> = {
  title: '用户',
  keyword: 'lov_demo',
  uniqueKey: 'userId',
  url: '/system/user/page',
  method: 'GET',
  position: 'PARAMS',
  fixedParams: {},
  multiple: false,
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
      render: (val) => <Tag>{val}</Tag>,
    },
  ],
  searchArray: [
    {
      label: 'ID',
      field: 'userId',
      html: 'input-number',
    },
    {
      label: '用户名',
      field: 'username',
      html: 'input',
    },
    {
      label: '搜索的昵称',
      field: 'nickname',
      html: (setVal) => {
        return <Input addonBefore={'test'} onChange={(e) => setVal(e.target.value)} />;
      },
    },
  ],
};
