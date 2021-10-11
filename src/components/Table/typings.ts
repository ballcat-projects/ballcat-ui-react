import type { ProTableProps } from '@ant-design/pro-table';
import type { PageResult, QueryParam, R } from '@/typings';

export type TableProps<T, U, ValueType = 'text'> = {
  request?: (params: QueryParam<U>) => Promise<R<PageResult<T>>>;
} & Omit<ProTableProps<T, U, ValueType>, 'request'>;
