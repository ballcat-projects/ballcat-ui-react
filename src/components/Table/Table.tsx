import { Button } from 'antd';
// @ts-ignore
import type { SearchConfig } from '@ant-design/pro-table/components/Form/FormRender';
import ProTable from '@ant-design/pro-table';
import type { TableProps } from '@/components/Table/typings';

export const SortOrderTransfer: Record<string, string> = {
  descend: 'desc',
  ascend: 'asc',
};

const getSearch = (search: false | SearchConfig) => {
  let proSearch = search;
  if (proSearch === undefined || proSearch === null) {
    proSearch = {};
  }

  if (proSearch && !proSearch.optionRender) {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    proSearch.optionRender = (sc, fp, dom) => {
      const { form } = sc;
      return (
        <div>
          <Button
            style={{ marginRight: '5px' }}
            type={'primary'}
            // @ts-ignore
            loading={sc.submitter.props.submitButtonProps.loading}
            onClick={() => {
              form?.submit();
            }}
          >
            {sc.searchText}
          </Button>

          <Button
            onClick={() => {
              form?.resetFields();
            }}
          >
            {sc.resetText}
          </Button>
        </div>
      );
    };
  }
  return proSearch;
};

const Table = <T extends Record<string, any>, U extends Record<string, any>, ValueType = 'text'>(
  props: TableProps<T, U, ValueType>,
) => {
  const { search, request, rowKey, options, rowSelection } = props;
  const { pagination = {} } = props;
  let { onRow, scroll } = props;
  if (!onRow) {
    onRow = () => {
      return {
        onClick: (e) => {
          if (
            e.target instanceof HTMLElement &&
            (e.target.tagName.toUpperCase() === 'TD' || e.target?.tagName.toUpperCase() === 'TR')
          ) {
            // 单击表格中的非展示数据元素， 选中当前列
            if (rowSelection && rowSelection.type) {
              const es = e.currentTarget.getElementsByClassName(`ant-${rowSelection.type}-wrapper`);
              if (es && es[0] instanceof HTMLElement) {
                es[0].click();
              }
            }
          }
        },
      };
    };
  }

  if (!scroll) {
    scroll = { x: '100%' };
  }

  // 设置默认的分页大小
  if (pagination !== false && !pagination.pageSize) {
    pagination.pageSize = 10;
  }

  return (
    <ProTable<T, U, ValueType>
      {...props}
      onRow={onRow}
      scroll={scroll}
      pagination={pagination}
      options={
        options !== false
          ? {
              fullScreen: true,
              reload: true,
              setting: true,
              density: true,
              // 采用覆盖默认值形式
              ...options,
            }
          : false
      }
      search={getSearch(search)}
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      request={async (p, sort, filter) => {
        const retData: { data: T[]; success: boolean; total: number } = {
          data: [],
          success: true,
          total: 0,
        };
        if (!request) {
          return Promise.resolve(retData);
        }

        const sortFields: string[] = [];
        const sortOrders: string[] = [];
        const keys = sort ? Object.keys(sort) : [];
        // 排序处理
        if (keys.length > 0) {
          keys.forEach((key) => {
            sortFields.push(key);
            sortOrders.push(SortOrderTransfer[sort[key] || 'descend']);
          });
        } else if (typeof rowKey === 'string') {
          sortFields.push(rowKey);
          sortOrders.push('order');
        }

        const params: any = {
          ...p,
          size: p.pageSize,
          sortFields,
          sortOrders,
        };
        delete params.pageSize;
        const res = await request(params);
        if (pagination) {
          // 分页处理
          const { records, total } = res.data;
          retData.data = records;
          retData.total = total;
        } else {
          // 不分页. 默认返回的data就是完整的数据
          retData.data = res.data as unknown as T[];
          retData.total = retData.data.length;
        }
        return retData;
      }}
    />
  );
};

export default Table;
