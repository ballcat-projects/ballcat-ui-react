import type { PageResult, QueryParam, R } from '@/typings';
import type React from 'react';
import type { ProColumns } from '@ant-design/pro-table';
import type { FormStatus } from '../LtForm';
import type { AuthNpProps } from '../Auth';
import type { LtTableProps } from '../LtTable/typings';
import type { ModalFormProps } from '@/components/LtForm';

export type PageToolBarActions = 'create' | JSX.Element;

export type PageOperateBarPreset = {
  type: 'edit' | 'del';
  permission: string;
  // 对 onClick  和 permission 的传递无效
  props?: AuthNpProps;
};

// export type PageOperateBar = PageOperateBarPreset | JSX.Element;
export type PageOperateBar<T> =
  | PageOperateBarPreset
  | ((dom: React.ReactNode, data: T) => JSX.Element);

// t : 表格字典
// u : 表格请求字段
// e : 表单字段
// p : 表单请求字段
export type PageProps<T, U, E, P = E, ValueType = 'text'> = {
  rowKey: string;
  columns: ProColumns<T, ValueType>[];
  query: (params: QueryParam<U>) => Promise<R<PageResult<T>>>;
  title?: string;
  // 创建请求
  create?: (body: P) => Promise<R<any>>;
  // 编辑请求
  edit?: (body: P) => Promise<R<any>>;
  // 删除请求
  del?: (body: T) => Promise<R<any>>;
  // 表单回填数据: 查询返回的数据 转为 表单展示的数据
  formData?: (data: T) => E;
  // 请求数据处理, 处理后的数据用来发起 创建, 编辑, 删除请求
  handlerData?: (body: E, status: FormStatus) => P;
  // 表格上方工具栏
  toolBarActions?: PageToolBarActions[];
  // 表格右侧操作列
  operateBar?: PageOperateBar<T>[];
  // 状态变更时执行
  onStatusChange?: (st: FormStatus) => void;
  // 创建, 编辑 请求完成后执行
  onFinish?: (status: FormStatus, body: P) => void;
  children?: React.ReactNode;
  // rowKey columns 等 无法配置
  tableProps?: LtTableProps<T, U, ValueType>;
  // 部分无法配置
  modalProps?: ModalFormProps<E, P>;
};
