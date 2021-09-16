export type SysMenuQo = {
  // 菜单ID
  id: number;
  // 菜单名称
  title: string;
  // 授权标识
  permission: string;
  // 路由地址
  path: string;
};

export type SysMenuVo = {
  // 菜单ID
  id: number;
  // 父级ID
  parentId: number;
  // 菜单名称
  title: string;
  // 菜单名称
  i18nTitle: string;
  // 菜单图标
  icon: string;
  // 授权标识
  permission: string;
  // 路由地址
  path: string;
  // 打开方式 (1组件 2内链 3外链)
  targetType: number;
  // 定位标识 (打开方式为组件时其值为组件相对路径，其他为URL地址)
  uri: string;
  // 显示排序
  sort: number;
  // 组件缓存：0-开启，1-关闭
  keepAlive: number;
  // 隐藏菜单: 0-否，1-是
  hidden: number;
  // 菜单类型 （0目录，1菜单，2按钮）
  type: number;
  // 备注信息
  remarks: string;
  // 创建时间
  createTime: string;
  // 更新时间
  updateTime: string;
  // 子级
  children: SysMenuVo[];
};

export type SysMenuDto = {
  // 菜单ID
  id: number;
  // 父级ID
  parentId: number;
  // 菜单名称
  title: string;
  // 菜单图标
  icon: string;
  // 授权标识
  permission: string;
  // 路由地址
  path: string;
  // 打开方式 (1组件 2内链 3外链)
  targetType: number;
  // 定位标识 (打开方式为组件时其值为组件相对路径，其他为URL地址)
  uri: string;
  // 显示排序
  sort: number;
  // 组件缓存：0-开启，1-关闭
  keepAlive: number;
  // 隐藏菜单: 0-否，1-是
  hidden: number;
  // 菜单类型 （0目录，1菜单，2按钮）
  type: number;
  // 备注信息
  remarks: string;
  // 菜单标题对应的国际化信息
  i18nMessages: SysMenuI18n[];
  // 原菜单ID
  originalId: number;
};

export type SysMenuI18n = {
  //  国际化标识
  code: string;
  // 消息
  message: string;
  // 地区语言标签
  languageTag: string;
};

export type SysMenuRoleGrateVo = {
  // 菜单ID
  id: number;
  // 父级ID
  parentId: number;
  // 菜单名称
  title: string;
  // 菜单类型 （0目录，1菜单，2按钮）
  type: 0 | 1 | 2;
};
