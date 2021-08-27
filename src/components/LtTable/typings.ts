import type {
  ActionType,
  ColumnsState,
  ListToolBarProps,
  ProColumns,
  ProTableProps,
} from '@ant-design/pro-table';
import type { PageResult, QueryParam, R } from '@/typings';
import type React from 'react';
import type { CSSProperties } from 'react';
import type { DensitySize } from '@ant-design/pro-table/lib/components/ToolBar/DensityIcon';
import type { CardProps } from 'antd/lib/card';
import type { TableProps } from 'antd/lib/table/Table';
import type { TableFormItem } from '@ant-design/pro-table/lib/components/Form/FormRender';
import type { OptionConfig, ToolBarProps } from '@ant-design/pro-table/lib/components/ToolBar';
import type { SpinProps } from 'antd/lib/spin';
import type { LabelTooltipType } from 'antd/lib/form/FormItemLabel';
import type { SearchConfig } from '@ant-design/pro-form/lib/components/Submitter';
import type { ProFormProps, QueryFilterProps } from '@ant-design/pro-form';
import type { AlertRenderType } from '@ant-design/pro-table/lib/components/Alert';
import type { ProSchemaComponentTypes, RowEditableConfig } from '@ant-design/pro-utils';
import type { ProFieldEmptyText } from '@ant-design/pro-field';
import type { Bordered } from '@ant-design/pro-table/lib/typing';

export type LtTableProps<T, U, ValueType = 'text'> = {
  request?: (params: QueryParam<U>) => Promise<R<PageResult<T>>>;

  columns?: ProColumns<T, ValueType>[];
  /** @name ListToolBar 的属性 */
  toolbar?: ListToolBarProps;

  params?: U;

  columnsStateMap?: Record<string, ColumnsState>;

  onColumnsStateChange?: (map: Record<string, ColumnsState>) => void;

  onSizeChange?: (size: DensitySize) => void;

  /** @name table 外面卡片的设置 */
  cardProps?: CardProps;

  /** @name 渲染 table */
  tableRender?: (
    props: ProTableProps<T, U, ValueType>,
    defaultDom: JSX.Element,
    /** 各个区域的 dom */
    domList: {
      toolbar: JSX.Element | undefined;
      alert: JSX.Element | undefined;
      table: JSX.Element | undefined;
    },
  ) => React.ReactNode;

  /** @name 渲染 table 视图，用于定制 ProList，不推荐直接使用 */
  tableViewRender?: (props: TableProps<T>, defaultDom: JSX.Element) => JSX.Element | undefined;

  tableExtraRender?: (props: ProTableProps<T, U, ValueType>, dataSource: T[]) => React.ReactNode;

  /** @name 对数据进行一些处理 */
  postData?: (data: any[]) => any[];
  /** @name 默认的数据 */
  defaultData?: T[];

  /** @name 初始化的参数，可以操作 table */
  actionRef?: React.MutableRefObject<ActionType | undefined> | ((actionRef: ActionType) => void);

  /** @name 操作自带的 form */
  formRef?: TableFormItem<T>['formRef'];
  /** @name 渲染操作栏 */
  toolBarRender?: ToolBarProps<T>['toolBarRender'] | false;

  /** @name 数据加载完成后触发 */
  onLoad?: (dataSource: T[]) => void;

  /** @name loading 被修改时触发，一般是网络请求导致的 */
  onLoadingChange?: (loading: boolean | SpinProps | undefined) => void;

  /** @name 数据加载失败时触发 */
  onRequestError?: (e: Error) => void;

  /**
   * 是否轮询 ProTable 它不会自动提交表单，如果你想自动提交表单的功能，需要在 onValueChange 中调用 formRef.current?.submit()
   *
   * @param dataSource 返回当前的表单数据，你可以用它判断要不要打开轮询
   */
  polling?: number | ((dataSource: T[]) => number);

  /** @name 给封装的 table 的 className */
  tableClassName?: string;

  /** @name 给封装的 table 的 style */
  tableStyle?: CSSProperties;

  /** @name 左上角的 title */
  headerTitle?: React.ReactNode;

  /** @name 标题旁边的 tooltip */
  tooltip?: string | LabelTooltipType;

  /** @name 操作栏配置 */
  options?: OptionConfig | false;

  /**
   * @type SearchConfig
   * @name 是否显示搜索表单
   */
  search?: false | SearchConfig;

  /**
   * 基本配置与 antd Form 相同, 但是劫持了 form onFinish 的配置
   *
   * @name type="form" 和 搜索表单 的 Form 配置
   */
  form?: Omit<ProFormProps & QueryFilterProps, 'form'>;
  /**
   * 暂时只支持 moment - string 会格式化为 YYYY-DD-MM - number 代表时间戳
   *
   * @name 如何格式化日期
   */
  dateFormatter?: 'string' | 'number' | false;
  /** @name 格式化搜索表单提交数据 */
  beforeSearchSubmit?: (params: Partial<U>) => any;
  /**
   * 设置或者返回false 即可关闭
   *
   * @name 自定义 table 的 alert
   */
  tableAlertRender?: AlertRenderType<T>;
  /**
   * 设置或者返回false 即可关闭
   *
   * @name 自定义 table 的 alert 的操作
   */
  tableAlertOptionRender?: AlertRenderType<T>;

  /** @name 选择项配置 */
  rowSelection?: TableProps<T>['rowSelection'] | false;

  style?: React.CSSProperties;

  /** 支持 ProTable 的类型 */
  type?: ProSchemaComponentTypes;

  /** @name 提交表单时触发 */
  onSubmit?: (params: U) => void;

  /** @name 重置表单时触发 */
  onReset?: () => void;

  /** @name 空值时显示 */
  columnEmptyText?: ProFieldEmptyText;

  /** @name 是否手动触发请求 */
  manualRequest?: boolean;
  /** @name 编辑行相关的配置 */
  editable?: RowEditableConfig<T>;

  /** @name 可编辑表格修改数据的改变 */
  onDataSourceChange?: (dataSource: T[]) => void;
  /** @name 查询表单和 Table 的卡片 border 配置 */
  cardBordered?: Bordered;
  /** Debounce time */
  debounceTime?: number;
} & Omit<TableProps<T>, 'columns' | 'rowSelection'>;
