export type AnnouncementQo = {
  // 标题
  title: string;
  // 接收人筛选方式
  recipientFilterType: number;
  // 状态
  status: number[];
};
export type AnnouncementVo = {
  // ID
  id: string;
  // 标题
  title: string;
  // 内容
  content: string;
  // 接收人筛选方式，1：全部 2：用户角色 3：组织机构 4：用户类型 5：自定义用户
  recipientFilterType: number;
  // 对应接收人筛选方式的条件信息，多个用逗号分割。如角色标识，组织ID，用户类型，用户ID等
  recipientFilterCondition: any[];
  // 接收方式，值与通知渠道一一对应
  receiveMode: number[];
  // 状态
  status: number;
  // 永久有效的
  immortal: number;
  // 截止日期
  deadline: string;
  // 创建人ID
  createBy: number;
  // 创建人名称
  createUsername: string;
  // 创建时间
  createTime: string;
  // 更新时间
  updateTime: string;
};

export type AnnouncementDto = {
  // ID
  id: string;
  // 标题
  title: string;
  // 内容
  content: string;
  // 接收人筛选方式，1：全部 2：用户角色 3：组织机构 4：用户类型 5：自定义用户
  recipientFilterType: number;
  // 对应接收人筛选方式的条件信息，多个用逗号分割。如角色标识，组织ID，用户类型，用户ID等
  recipientFilterCondition: any[];
  // 接收方式，值与通知渠道一一对应
  receiveMode: number[];
  // 永久有效的
  immortal: number;
  // 截止日期
  deadline: string;
  // 状态
  status: number;
};
