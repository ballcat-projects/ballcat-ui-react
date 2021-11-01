export type SysOrganization = {
  id: number;
  // 组织名称
  name: string;
  // 父级ID
  parentId: number;
  // 层级信息，从根节点到当前节点的最短路径，使用-分割节点ID
  hierarchy: string;
  // 当前节点深度
  depth: number;
  // 备注
  remarks: string;
  // 排序字段，由小到大
  sort: number;
  // 创建者
  createBy: string;
  // 修改者
  updateBy: string;
  // 创建时间
  createTime: string;
  // 更新时间
  updateTime: string;
};

export type SysOrganizationQo = {
  name: string;
};

export type SysOrganizationVo = {
  id: number;
  // 组织名称
  name: string;
  // 父级ID
  parentId: number;
  // 层级信息，从根节点到当前节点的最短路径，使用-分割节点ID
  hierarchy: string;
  // 当前节点深度
  depth: number;
  // 备注
  remarks: string;
  // 排序字段，由小到大
  sort: number;
  // 创建者
  createBy: string;
  // 修改者
  updateBy: string;
  // 创建时间
  createTime: string;
  // 更新时间
  updateTime: string;
  // 下级组织
  children: SysOrganizationVo[];
};

export type SysOrganizationDto = {
  id: number;
  // 组织名称
  name: string;
  // 父级ID
  parentId: number;
  // 备注
  remarks: string;
  // 排序字段，由小到大
  sort: number;
};
