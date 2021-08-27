import React, { useEffect, useState } from 'react';
import { request } from 'umi';
import { Modal, Select } from 'antd';
// @ts-ignore
import type { SearchConfig } from '@ant-design/pro-table/components/Form/FormRender';
import type { ProColumns } from '@ant-design/pro-table';
import type { LovConfig, LovModalProps } from '@/components/Lov/typing';
import type { PageResult, R } from '@/typings';
import LtTable from '@/components/LtTable';

type ModalProps = {
  show: boolean;
  setShow: (show: boolean) => void;
  setValue: (val: any) => void;
};

const defaultModalStyle: React.CSSProperties = {
  width: '800px',
};

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

const LovModal: React.FC<LovModalProps & LovConfig<any> & ModalProps> = (props) => {
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

  const getRet = (row: any): any => {
    if (typeof config.ret === 'string') {
      return row[config.ret];
    }
    return config.ret(row);
  };

  const { value, setValue, title, show, setShow, modalStyle, modalProperties } = props;

  const [showData, setShowData] = useState<any[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  useEffect(() => {
    if (value === undefined || value === null) {
      setShowData([]);
    } else if (config.multiple) {
      setShowData(value instanceof Array ? [...value] : [value]);
    } else {
      setShowData([value]);
    }
  }, [value]);

  const selectRow = (row: any) => {
    const retVal = getRet(row);
    if (config.multiple) {
      setShowData([...showData, retVal]);
      setSelectedRowKeys([...selectedRowKeys, row[config.uniqueKey]]);
      setSelectedRows([...selectedRows, row]);
    } else {
      setShowData([retVal]);
      setSelectedRowKeys([row[config.uniqueKey]]);
      setSelectedRows([row]);
    }
  };

  const unselectRow = (row: any) => {
    if (config.multiple) {
      const retVal = getRet(row);
      let index = showData.indexOf(retVal);
      if (index > -1) {
        showData.splice(index, 1);
        setShowData([...showData]);
      }
      index = selectedRowKeys.indexOf(row[config.uniqueKey]);

      if (index > -1) {
        selectedRowKeys.splice(index, 1);
        selectedRows.splice(index, 1);
        setSelectedRowKeys([...selectedRowKeys]);
        setSelectedRows([...selectedRows]);
      }
    } else {
      setShowData([]);
      setSelectedRowKeys([]);
      setSelectedRows([]);
    }
  };

  const style = { ...defaultModalStyle, ...modalStyle };
  return (
    <Modal
      style={style}
      width={style.width}
      {...modalProperties}
      bodyStyle={{ paddingTop: '0px', ...modalProperties?.paddingTop }}
      title={title}
      visible={show}
      onCancel={() => {
        setShow(false);
      }}
      onOk={() => {
        if (config.multiple) {
          setValue([...showData]);
        } else {
          setValue(showData);
        }
        setShow(false);
      }}
    >
      <LtTable
        options={{ fullScreen: false }}
        search={proSearch}
        scroll={{ x: true }}
        rowKey={config.uniqueKey}
        rowSelection={{
          fixed: true,
          type: config.multiple ? 'checkbox' : 'radio',
          selectedRowKeys,
          onSelect: (row, selected) => {
            if (selected) {
              selectRow(row);
            } else {
              unselectRow(row);
            }
          },
          onSelectAll: (selected, rows, changeRows) => {
            // 更新选中行
            changeRows.forEach((item) => {
              if (selected) {
                selectRow(item);
              } else {
                unselectRow(item);
              }
            });
          },
        }}
        postData={(data) => {
          let rowKeys = [...selectedRowKeys];
          let rows = [...selectedRows];
          data.forEach((item) => {
            if (rowKeys.indexOf(item[config.uniqueKey]) === -1) {
              const itemVal = getRet(item);
              if (showData.indexOf(itemVal) !== -1) {
                if (config.multiple) {
                  rowKeys.push(item[config.uniqueKey]);
                  rows.push(item);
                } else {
                  rowKeys = [].concat(item[config.uniqueKey]);
                  rows = [].concat(item);
                }
              }
            }
          });

          setSelectedRowKeys([...rowKeys]);
          setSelectedRows([...rows]);
          return data;
        }}
        tableAlertRender={false}
        columns={columns}
        request={(p) => {
          const option = {
            method: config.method,
            sendMessage: false,
          };
          option[config.position.toLowerCase()] = { ...p, ...config.fixedParams };

          return request<R<PageResult<any>>>(config.url, option);
        }}
        tableExtraRender={() => {
          return <Select value={showData} mode={'tags'} style={{ width: '100%' }} open={false} />;
        }}
      />
    </Modal>
  );
};

export default LovModal;
