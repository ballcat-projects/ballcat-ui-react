import React from 'react';
import { request } from 'umi';
// @ts-ignore
import type { SearchConfig } from '@ant-design/pro-table/components/Form/FormRender';
import type { ProColumns } from '@ant-design/pro-table';
import type { LovConfig } from '@/components/Lov/typing';
import type { PageResult, R } from '@/typings';
import LtTable from '@/components/LtTable';

function handlerColumns(columns: ProColumns<any>[], config: LovConfig<any>) {
  const map: Record<string, number> = {};
  // 配置表格列
  for (let i = 0; i < config.columns.length; i += 1) {
    const column = config.columns[i];
    const proColumn: ProColumns<any> = {
      title: column.title,
      dataIndex: column.field,
      copyable: column.copy,
      ellipsis: column.ellipsis,
      hideInSearch: true,
      hideInTable: false,
    };
    if (column.render) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      proColumn.render = (dom, record, index, action) => {
        if (typeof column.render === 'function') {
          return column.render(record[column.field], record);
        }
        return column.render;
      };
    }
    columns.push(proColumn);
    map[column.field] = i;
  }

  return map;
}

function handlerSearch(
  columns: ProColumns<any>[],
  config: LovConfig<any>,
  pMap: Record<string, number>,
) {
  if (!config.searchArray) {
    return pMap;
  }
  const map = { ...pMap };

  for (let i = 0; i < config.searchArray.length; i += 1) {
    const search = config.searchArray[i];
    const proColumn: ProColumns<any> = map[search.field]
      ? columns[map[search.field]]
      : {
          dataIndex: search.field,
          hideInTable: true,
        };

    proColumn.hideInSearch = false;
    proColumn.order = config.searchArray.length - i;
    // eslint-disable-next-line eqeqeq
    if (proColumn.title != search.label) {
      const { title } = proColumn;
      proColumn.title = (_, type) => (type === 'table' ? title : search.label);
    }

    if (typeof search.html === 'function') {
      proColumn.renderFormItem = (item, p, form) => {
        const setVal = (val: any) => {
          const fv: any = {};
          fv[search.field] = val;
          form.setFieldsValue(fv);
        };

        // @ts-ignore
        return search.html(setVal);
      };
    } else {
      proColumn.valueType = search.html === 'input' ? 'text' : 'digit';
    }

    if (!map[search.field]) {
      columns.push(proColumn);
      map[search.field] = columns.length - 1;
    }
  }

  return map;
}

const LovModal: React.FC<LovConfig<any>> = (props) => {
  const config: LovConfig<any> = props;
  const columns: ProColumns<any>[] = [];
  // 初始 map 并配置 表格列数据
  const map: Record<string, number> = handlerColumns(columns, config);

  // 搜索列
  let proSearch: false | SearchConfig = false;
  if (config.searchArray && config.searchArray.length > 0) {
    proSearch = undefined;
    handlerSearch(columns, config, map);
  }

  return (
    <div>
      <LtTable
        options={{ fullScreen: false }}
        search={proSearch}
        rowKey={config.uniqueKey}
        columns={columns}
        request={(p) => {
          const option = {
            method: config.method,
            sendMessage: false,
          };
          option[config.position.toLowerCase()] = { ...p, ...config.fixedParams };

          return request<R<PageResult<any>>>(config.url, option);
        }}
      />
    </div>
  );
};

export default LovModal;
