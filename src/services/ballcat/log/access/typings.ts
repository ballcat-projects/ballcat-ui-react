export type AccessLogVo = {
  // 编号
  id: string;
  // 追踪ID
  traceId: string;
  // 用户ID
  userId: number;
  // 用户名
  username: string;
  // 访问IP地址
  ip: string;
  // 用户代理
  userAgent: string;
  // 请求URI
  uri: string;
  // 请求映射地址
  matchingPattern: string;
  // 操作方式
  method: string;
  // 请求参数
  reqParams: string;
  // 请求body
  reqBody: string;
  // 响应状态码
  httpStatus: number;
  // 响应信息
  result: string;
  // 错误消息
  errorMsg: string;
  // 执行时长
  time: string;
  // 创建时间
  createTime: string;
};

export type AccessLogQo = {
  // 追踪ID
  traceId: string;
  // 用户ID
  userId: number;
  // 访问IP地址
  ip: string;
  // 请求Uri
  uri: string;
  // 请求映射地址
  matchingPattern: string;
  // 响应状态码
  httpStatus: number;
  // 登陆时间区间（开始时间）
  startTime: string;
  // 登陆时间区间（结束时间）
  endTime: string;
};
