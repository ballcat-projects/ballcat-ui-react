export type DocumentQo = {
  // ID
  id: number;
};

export type DocumentVo = {
  // ID
  id: number;
  // 文档名称
  name: string;
  // 所属用户ID
  userId: number;
  // 用户名
  username: string;
  // 所属组织ID
  organizationId: number;
  // 组织名
  organizationName: string;
  // 创建时间
  createTime: string;
  // 更新时间
  updateTime: string;
};

export type Document = {
  // ID
  id: number;
  // 文档名称
  name: string;
  // 所属用户ID
  userId: number;
  // 所属组织ID
  organizationId: number;
  // 创建时间
  createTime: string;
  // 更新时间
  updateTime: string;
};
