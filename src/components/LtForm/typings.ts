import type { R } from '@/typings';
import type React from 'react';
import type { ColProps } from 'antd';

export type FormStatus = 'read' | 'edit' | 'create' | undefined;

export type FormRef<E> = {
  // 只读
  read: (row: E) => void;
  // 编辑
  edit: (row: E) => void;
  // 新增
  create: () => void;
};

export type FormProps<E> = {
  mfRef?: React.MutableRefObject<FormRef<E> | undefined>;
  statusChange?: (status: FormStatus) => void;
  title?: {
    read?: string;
    edit?: string;
    create?: string;
  };
  width?: string;
  labelCol?: ColProps;
  wrapperCol?: ColProps;
  // 数据处理, 处理后的数据用来发起创建或者编辑请求
  handlerData?: (body: Record<string, any>, status: FormStatus) => E;
  // 创建请求
  create?: (body: E) => Promise<R<any>>;
  // 编辑请求
  edit?: (body: E) => Promise<R<any>>;
  // 请求完成后执行
  onFinish?: (status: FormStatus, body: E) => void;
};

export type ModalFormProps<E> = {
  children?: React.ReactNode;
} & FormProps<E>;
