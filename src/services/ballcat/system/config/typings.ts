export type SysConfig = {
  // 主键
  id: number;
  // 配置名称
  name: string;
  // 配置在缓存中的key名
  confKey: string;
  // 配置值
  confValue: string;
  // 分类
  category: string;
  // 备注
  remarks: string;
  // 逻辑删除标识
  deleted: string;
  // 创建时间
  createTime: string;
  // 修改时间
  updateTime: string;
};

export type SysConfigQo = {
  // 配置名称
  name: string;
  // 配置在缓存中的key名
  confKey: string;
  // 分类
  category: string;
};

export type SysConfigVo = {
  // 主键
  id: number;
  // 配置名称
  name: string;
  // 配置在缓存中的key名
  confKey: string;
  // 配置值
  confValue: string;
  // 分类
  category: string;
  // 备注
  remarks: string;
  // 创建时间
  createTime: string;
  // 修改时间
  updateTime: string;
};
