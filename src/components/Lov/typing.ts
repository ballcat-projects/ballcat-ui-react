import type React from 'react';

export type LovProps = {
  keyword: string;
} & LovModalProps;

export type LovConfig<T> = {
  // 标题
  title: string;
  // 关键字
  keyword: string;
  // 唯一字段
  uniqueKey: string;
  // 请求路径
  url: string;
  // 请求方式
  method: 'GET' | 'POST' | 'HEAD' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'TRACE';
  // 参数位置
  position: 'DATA' | 'PARAMS';
  // 固定请求参数
  fixedParams?: Record<string, any>;
  // 是否多选
  multiple: boolean;
  // 是否展示确定和取消按钮
  isRet: boolean;
  // 返回结果 传入字符串则表示返回指定字段,  传入函数则表示自定义返回值
  ret: string | ((row: T) => any);
  // 表格列配置
  columns: LovColumns<T>[];
  // 搜索组件配置
  searchArray?: LovSearch[];
  // modal 样式
  modalStyle?: React.CSSProperties;
  // modal 属性配置
  modalProperties?: Record<string, any>;
};

export type LovColumns<T> = {
  // 列头
  title: string;
  // 字段
  field: string;
  // 是否可以复制
  copy?: boolean;
  // 是否自动缩略
  ellipsis?: boolean;
  /**
   *  自定义展示, 默认用 text展示内容, 可以传入一个函数, 或者 直接传入展示的内容
   *  函数参数: val 指定字段的值.
   *  函数参数: record 当前列所有数据
   */
  render?:
    | ((val: any, record: T) => React.ReactNode | React.ReactNode[])
    | React.ReactNode
    | React.ReactNode[];
};

export type LovSearch = {
  // 标签内容
  label: string;
  // 字段
  field: string;
  /**
   * 输入框样式, 选择 input 则普通的展示一个输入框
   * 函数参数: setVal 一个用来提交搜索值的函数, 当值发生变化时, 请调用该方法提交新值
   */
  html: 'input' | 'input-number' | ((setVal: (val: any) => void) => React.ReactNode);
};

export type LovModalProps = {
  // 值
  value?: any;
  // 参数为新值
  onChange?: (val: any) => void;
};
