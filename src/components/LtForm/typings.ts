import type { R } from '@/typings';
import type React from 'react';
import type { ColProps, FormItemProps, InputNumberProps } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import type { DictRadioProps, DictSelectProps } from '../Dict';
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
};

// e : 表单字段
// p : 请求字段
export type FormProps<E, P = E> = {
  mfRef?: React.MutableRefObject<FormRef<E> | undefined>;
  onStatusChange?: (status: FormStatus) => void;
  title?: {
    read?: string;
    edit?: string;
    create?: string;
  };
  width?: string;
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
};

export type ModalFormProps<E, P = E> = {
  children?: React.ReactNode;
} & FormProps<E, P>;

export type LtFormTooltip = LabelTooltipType & {
  icon?: string | JSX.Element;
};

export type LtFormItemProps<V = any> = FormItemProps<V>;

export type FormDictRadioProps<V = any> = {
  code: string;
  dictProps?: DictRadioProps;
} & LtFormItemProps<V>;

export type FormDictSelectProps<V = any> = {
  code: string;
  dictProps?: DictSelectProps;
} & LtFormItemProps<V>;

export type FormNumberProps<V = any> = {
  inputProps?: InputNumberProps<number>;
  placeholder?: string;
  min?: number;
  max?: number;
  style?: CSSProperties;
} & LtFormItemProps<V>;
