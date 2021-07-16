import { Button } from 'antd';
// @ts-ignore
import type { SearchConfig } from '@ant-design/pro-table/components/Form/FormRender';
import ProTable from '@ant-design/pro-table';
import type { LtTableProps } from '@/components/LtTable/typings';

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

const LtTable = <T extends Record<string, any>, U extends Record<string, any>>(
  props: LtTableProps<T, U>,
) => {
  const { search, request, rowKey } = props;

  return (
    <ProTable
      {...props}
      search={getSearch(search)}
      request={(p, sort, filter) => {
        const retData = { data: [], success: true, total: 0 };
        if (!request) {
          return Promise.resolve(retData);
        }

        const params = {
          ...p,
          size: p.pageSize,
          sortFields: rowKey,
          sortOrders: 'desc',
        };
        return request(params, sort, filter).then((res) => {
          // @ts-ignore
          const { records, total } = res.data;
          // @ts-ignore
          retData.data = records;
          retData.total = total;
          return retData;
        });
      }}
    />
  );
};

export default LtTable;
