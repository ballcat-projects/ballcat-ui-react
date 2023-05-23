export type SysUserVo = {
  // 用户ID
  userId: number;
  // 登录账号
  username: string;
  // 昵称
  nickname: string;
  // 头像
  avatar: string;
  // 性别(0-默认未知,1-男,2-女)
  gender: 0 | 1 | 2;
  // 电子邮件
  email: string;
  // 电话
  phoneNumber: string;
  // 状态(1-正常, 0-冻结)
  status: 1 | 0;
  // 用户类型：1-系统用户，2-客户用户
  type: 1 | 2;
  // 组织机构ID
  organizationId: number;
  // 组织机构名称
  organizationName: string;
  // 创建时间
  createTime: string;
  // 更新时间
  updateTime: string;
};

export type SysUserQo = {
  // 登录账号
  username: string;
  // 昵称
  nickname: string;
  // 性别(0-默认未知,1-男,2-女)
  gender: 0 | 1 | 2;
  // 电子邮件
  email: string;
  // 电话
  phoneNumber: string;
  // 状态(1-正常,2-冻结)
  status: 1 | 0;
  // organizationId
  organizationId: number[];
  // 用户类型:1:系统用户， 2：客户用户
  type: number;
  // 开始时间
  startTime: string;
  // 结束时间
  endTime: string;
};

export type SysUserDto = {
  // 主键id
  userId: number;
  // 前端传入密码-
  pass: string;
  // 登录账号
  username: string;
  // 昵称
  nickname: string;
  // 头像
  avatar: string;
  // 性别(0-默认未知,1-男,2-女)
  gender: number;
  // 电子邮件
  email: string;
  // 电话
  phoneNumber: string;
  // 状态(1-正常,2-冻结)
  status: number;
  // 组织机构ID
  organizationId: number;
  // 角色标识列表
  roleCodes: string[];
};

export type SysUserScopeVo = {
  roleCodes: string[];
};

export type SysUserScopeDto = {
  userId: number;
  username?: string;
  roleCodes: string[];
};

export type SysUserPassDto = {
  userId: number;
  username?: string;
  pass: string;
  confirmPass?: string;
};
