import type { PageResult, QueryParam, R } from '@/typings';
import type { ModalProps } from 'antd';
import type React from 'react';
import type * as options from './options';

export type LovProps<V = any, E = any> = {
  keyword: keyof typeof options;
  // 覆写配置
  overwriteConfig?: Partial<LovConfig<V, E>>;
} & LovModalProps<V, E>;

export type LovConfig<V, E, Q = Record<string, any>> = {
  // 标题
  title: string;
  // 唯一字段
  uniqueKey: keyof E;
  // 查询请求
  request: (params: QueryParam<Q>) => Promise<R<PageResult<E>>>;
  // 固定请求参数, 该参数值会覆盖搜索栏中同名的参数值
  fixedParams?: Partial<Q>;
  // 是否多选
  multiple: boolean;
  // 是否展示确定和取消按钮
  isRet: boolean;
  // 返回结果 传入字符串则表示返回指定字段,  传入函数则表示自定义返回值
  ret: keyof E | ((row: E) => V);
  // 表格列配置
  columns: LovColumns<E>[];
  // 搜索组件配置
  searchArray?: LovSearch<E>[];
  // modal 样式
  modalStyle?: React.CSSProperties;
  // modal 属性配置
  modalProperties?: ModalProps;
};

export type LovColumns<E> = {
  // 列头
  title: string;
  // 字段
  dataIndex: keyof E;
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
    | ((val: any, record: E) => React.ReactNode | React.ReactNode[])
    | React.ReactNode
    | React.ReactNode[];
};

export type LovSearch<E> = {
  // 标签内容
  label: string;
  // 字段
  field: keyof E;
  /**
   * 输入框样式, 选择 input 则普通的展示一个输入框
   * 函数参数: setVal 一个用来提交搜索值的函数, 当值发生变化时, 请调用该方法提交新值
   */
  html: 'input' | 'input-number' | ((setVal: (val: any) => void) => React.ReactNode);
};

export type LovModalProps<V, E, Q = Record<string, any>> = {
  // 值
  value?: V | V[];
  // 参数为新值
  onChange?: (val?: V | V[]) => void;
  // 选中的值完整数据
  onSelected?: (values: E[]) => void;
  // 动态参数. 该参数值会覆盖 固定参数以及搜索栏中同名的参数值
  dynamicParams?: Partial<Q>;
};
