import type { PageResult, QueryParam, R } from '@/typings';
import type React from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import type { FormStatus, ModalFormRef } from '../LtForm';
import type { AuthNoneProps } from '../Auth';
import type { LtTableProps } from '../LtTable/typings';
import type { LtModalFormProps } from '@/components/LtForm';

export type PageToolBarActions = { type: 'create'; permission: string } | JSX.Element;

export type PageOperateBarPreset = {
  type: 'edit' | 'del' | 'read';
  permission: string;
  // 对 onClick  和 permission 的传递无效
  props?: AuthNoneProps;
};

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
  // 表格右侧操作列参数
  operteBarProps?: { title?: string; width?: number; fixed?: 'left' | 'right' | boolean };
  /**
   *  状态变更前执行, 用于处理一些外部数据变更, 并且如果返回 false 则会中止状态变更行为.
   *  变更为新增时, record 为 undefined
   */
  perStatusChange?: (st: FormStatus, record?: T) => boolean | void;
  // 状态变更时执行
  onStatusChange?: (st: FormStatus) => void;
  // 创建, 编辑 请求完成后执行
  onFinish?: (status: FormStatus, body: P) => void;
  children?: React.ReactNode | React.ReactNode[];
  // rowKey columns 等 无法配置
  tableProps?: LtTableProps<T, U, ValueType>;
  // 部分无法配置
  modalProps?: LtModalFormProps<E, P>;
  tableRef?: React.MutableRefObject<ActionType | undefined>;
  modalRef?: React.MutableRefObject<ModalFormRef<E> | undefined>;
};
