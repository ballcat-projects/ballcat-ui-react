import type { R } from '@/typings';
import type React from 'react';
import type { ColProps, FormItemProps as AntdFormItemProps, InputNumberProps } from 'antd';
import type {
  ModalFormProps as AntdModalFormProps,
  ProFormInstance,
  ProFormProps,
} from '@ant-design/pro-form';
import type { DictCheckboxProps, DictRadioProps, DictSelectProps } from '../Dict';
import type { LabelTooltipType } from 'antd/lib/form/FormItemLabel';
import type { CSSProperties } from 'react';

export type FormStatus = 'read' | 'edit' | 'create' | undefined;

export type FormRef<E> = {
  // 只读
  read: (row: E) => void;
  // 编辑
  edit: (row: E) => void;
  // 新增
  create: (data?: any) => void;
  // 获取form表单的 ref
  getFormRef: () => ProFormInstance<E> | undefined;
  hidden: () => void;
};

export type ModalFormRef<E> = FormRef<E>;
export type FullFormRef<E> = FormRef<E>;

// e : 表单字段
// p : 请求字段
export type FormProps<E, P = E> = {
  mfRef?: React.MutableRefObject<FormRef<E> | undefined>;
  onStatusChange?: (status: FormStatus) => void;
  titleSuffix?: string;
  labelCol?: ColProps;
  wrapperCol?: ColProps;
  // 数据处理, 处理后的数据用来发起创建或者编辑请求
  handlerData?: (body: E, status: FormStatus) => P;
  // 创建请求
  create?: (body: P) => Promise<R<any>>;
  // 编辑请求
  edit?: (body: P) => Promise<R<any>>;
  // 请求完成后执行
  onFinish?: (status: FormStatus, body: P) => void;
  // 创建, 编辑 请求出错成后执行
  onError?: (e: any) => void;
  children?: React.ReactNode;
};

export type ModalFormProps<E, P = E> = {
  mfRef?: React.MutableRefObject<ModalFormRef<E> | undefined>;
  // 扩展
  antProps?: AntdModalFormProps<E>;
  width?: string;
} & Omit<FormProps<E, P>, 'mfRef'>;

export type FullFormProps<E, P = E> = {
  mfRef?: React.MutableRefObject<FullFormRef<E> | undefined>;
  // 扩展
  antProps?: ProFormProps<E>;
} & Omit<FormProps<E, P>, 'mfRef'>;

export type FormTooltip = LabelTooltipType & {
  icon?: string | JSX.Element;
};

export type FormItemProps<V = any> = AntdFormItemProps<V>;

export type FormDictProps<V, DP> = {
  code: string;
  dictProps?: Omit<DP, 'code'>;
} & FormItemProps<V>;

export type FormDictRadioProps<V = any> = FormDictProps<V, DictRadioProps>;

export type FormDictSelectProps<V = any> = FormDictProps<V, DictSelectProps>;

export type FormDictCheckboxProps<V = any> = FormDictProps<V, DictCheckboxProps>;

export type FormNumberProps<V = any> = {
  inputProps?: InputNumberProps<number>;
  placeholder?: string;
  min?: number;
  max?: number;
  style?: CSSProperties;
} & FormItemProps<V>;

export type FormGroupProps = {
  children?: JSX.Element | JSX.Element[];
};
