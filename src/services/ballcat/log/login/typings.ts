export type LoginLogVo = {
  // 编号
  id: string;
  // 追踪ID
  traceId: string;
  // 用户名
  username: string;
  // 操作信息
  ip: string;
  // 操作系统
  os: string;
  // 状态
  status: number;
  // 日志消息
  msg: string;
  // 登陆地点
  location: string;
  // 事件类型 登陆/登出
  eventType: number;
  // 浏览器
  browser: string;
  // 登录/登出时间
  loginTime: string;
  // 创建时间
  createTime: string;
};

export type LoginLogQo = {
  // 追踪ID
  traceId: string;
  // 用户名
  username: string;
  // 操作信息
  ip: string;
  // 状态
  status: number;
  // 事件类型 登陆/登出
  eventType: number;
  // 登陆时间区间（开始时间）
  startTime: string;
  // 登陆时间区间（结束时间）
  endTime: string;
};
