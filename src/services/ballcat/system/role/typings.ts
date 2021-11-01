export type SysRole = {
  // 角色编号
  id: number;
  // 角色名称
  name: string;
  // 角色标识
  code: string;
  // 角色备注
  remarks: string;
  // 角色类型，1：系统角色 2：业务角色
  type: 1 | 2;
  // 逻辑删除标识，已删除:0，未删除：删除时间戳
  deleted: string;
  // 创建时间
  createTime: string;
  // 修改时间
  updateTime: string;
  // 数据权限：1全部，2本人，3本人及子部门，4本部门
  scopeType: 1 | 2 | 3 | 4;
};

export type SysRoleQo = {
  // 角色名称
  name: string;
  // 角色标识
  code: string;
  // 开始时间
  startTime: string;
  // 结束时间
  endTime: string;
};

export type SysRoleVo = {
  // 角色编号
  id: number;
  // 角色名称
  name: string;
  // 角色标识
  code: string;
  // 角色备注
  remarks: string;
  // 角色类型，1：系统角色 2：业务角色
  type: 1 | 2;
  // 数据权限：1全部，2本人，3本人及子部门，4本部门
  scopeType: 1 | 2 | 3 | 4;
  // 创建时间
  createTime: string;
  // 更新时间
  updateTime: string;
};

export type SysRoleBindQo = {
  // 角色标识
  roleCode: string;
  // 用户ID
  userId: number;
  // 用户名
  username: string;
  // 组织ID
  organizationId: number;
};

export type SysRoleBindVo = {
  // 用户ID
  userId: number;
  // 登录账号
  username: string;
  // 昵称
  nickname: string;
  // 1:系统用户， 2：客户用户
  type: number;
  // 组织机构ID
  organizationId: number;
  // 组织机构名称
  organizationName: string;
};
