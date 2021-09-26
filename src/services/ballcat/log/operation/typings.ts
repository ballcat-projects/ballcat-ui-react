export type OperationLogVo = {
  // 编号
  id: string;
  // 追踪ID
  traceId: string;
  // 日志消息
  msg: string;
  // 访问IP地址
  ip: string;
  // 用户代理
  userAgent: string;
  // 请求URI
  uri: string;
  // 请求方法
  method: string;
  // 操作提交的数据
  params: string;
  // 操作状态
  status: number;
  // 操作类型
  type: number;
  // 执行时长
  time: string;
  // 创建者
  operator: string;
  // 创建时间
  createTime: string;
};

export type OperationLogQo = {
  // 追踪ID
  traceId: string;
  // 用户ID
  userId: number;
  // 日志消息
  msg: string;
  // 访问IP地址
  ip: string;
  // 请求URI
  uri: string;
  // 操作状态
  status: number;
  // 操作类型
  type: number;
  // 登陆时间区间（开始时间）
  startTime: string;
  // 登陆时间区间（结束时间）
  endTime: string;
};
