export type SysDict = {
  /**
   * 编号
   */
  id: number;

  /**
   * 标识
   */
  code: string;

  /**
   * 名称
   */
  title: string;

  /**
   * Hash值
   */
  hashCode: string;

  /**
   * 备注
   */
  remarks: string;

  /**
   * 状态,1：启用 0：禁用
   */
  status: number;

  /**
   * 数据类型,1:Number 2:String 3:Boolean
   */
  valueType: number;

  /**
   * 逻辑删除标识，已删除:0，未删除：删除时间戳
   */
  deleted: string;

  /**
   * 创建时间
   */
  createTime: string;

  /**
   * 更新时间
   */
  updateTime: string;
};

// 字典查询参数
export type SysDictQo = {
  code: string;
  title: string;
};

// 字典查询返回
export type SysDictVo = SysDict;

export type BadgeStatus = 'success' | 'processing' | 'default' | 'error' | 'warning';
export const badgeStatusArray = ['success', 'processing', 'default', 'error', 'warning'];
export const badgeDefaultColorArray = [
  'pink',
  'red',
  'yellow',
  'orange',
  'cyan',
  'green',
  'blue',
  'purple',
  'geekblue',
  'magenta',
  'volcano',
  'gold',
  'lime',
];

export const tagDefaultColorArray = [
  'pink',
  'magenta',
  'red',
  'volcano',
  'orange',
  'gold',
  'lime',
  'green',
  'cyan',
  'blue',
  'geekblue',
  'purple',
  'success',
  'processing',
  'error',
  'warning',
];

export const sysDictItemAttributesKeys = [
  'languages',
  'tagColor',
  'textColor',
  'badgeColor',
  'badgeStatus',
];

export type SysDictItemAttributes = {
  languages?: Record<string, string>;
  tagColor?: string;
  textColor?: string;
  badgeColor?: string;
  badgeStatus?: BadgeStatus;
};

export type SysDictItem = {
  id: number;
  // 字典标识
  dictCode: string;
  // 数据值
  value: string;
  // 文本值
  name: string;
  // 附加属性值
  attributes: SysDictItemAttributes;
  // 排序（升序）
  sort: number;
  // 备注
  remarks: string;
  // 创建时间
  createTime: string;
  // 更新时间
  updateTime: string;
};

// 字典项查询参数
export type SysDictItemQo = {
  dictCode: string;
};

// 字典项查询返回
export type SysDictItemVo = {
  /**
   * 状态,1：启用 0：禁用
   */
  status: number;
} & SysDictItem;

// 字典项展示数据获取
export type SysDictDataItem = {
  id: number;
  // 文本值
  name: string;
  // 数据值
  value: string;
  // 附加属性值
  attributes: SysDictItemAttributes;
  // 真实数据
  realVal: any;
};

// 字典展示数据获取
export type SysDictData = {
  dictCode: string;
  hashCode: string;
  // 1: 数字; 2: 字符串; 3: 布尔
  valueType: 1 | 2 | 3;
  dictItems: SysDictDataItem[];
  loading: boolean;
};

export type SysDictDataHash = Record<string, string>;
