import React, { useEffect, useState, useRef } from 'react';
import { request } from 'umi';
import { Modal, Select } from 'antd';
// @ts-ignore
import type { SearchConfig } from '@ant-design/pro-table/components/Form/FormRender';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import type { LovConfig, LovModalProps } from '@/components/Lov/typing';
import type { PageResult, R } from '@/typings';
import Table from '@/components/Table';

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

function getRet(row: any, config: LovConfig<any>) {
  if (typeof config.ret === 'string') {
    return row[config.ret];
  }
  return config.ret(row);
}

const LovModal: React.FC<LovModalProps & LovConfig<any> & ModalProps> = (props) => {
  const config: LovConfig<any> = props;

  const { value, setValue, title, show, setShow, modalStyle, modalProperties, dynamicParams } =
    props;

  const tableRef = useRef<ActionType>();

  const [columns, setColumns] = useState<ProColumns<any>[]>([]);
  const [proSearch, setProSearch] = useState<false | SearchConfig>(false);

  const [showData, setShowData] = useState<any[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  const postData = (data: any[]) => {
    let rowKeys = [...selectedRowKeys];
    let rows = [...selectedRows];
    data.forEach((item) => {
      if (rowKeys.indexOf(item[config.uniqueKey]) === -1) {
        const itemVal = getRet(item, config);
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
  };

  const selectRow = (...rows: any[]) => {
    const newShowData: any[] = [...showData];
    const newSelectedRows: any[] = [...selectedRows];
    const newSelectedRowKeys: any[] = [...selectedRowKeys];

    if (config.multiple) {
      rows.forEach((row) => {
        const retVal = getRet(row, config);
        if (newShowData.indexOf(retVal) === -1) {
          newShowData.push(retVal);
          newSelectedRows.push(row);
          newSelectedRowKeys.push(row[config.uniqueKey]);
        }
      });
    } else {
      // 单选. 默认为选中第一个
      const row = rows[0];
      // 单选处理
      newShowData.splice(0, newShowData.length);
      newShowData.push(getRet(row, config));

      newSelectedRows.splice(0, newSelectedRows.length);
      newSelectedRows.push(row);

      newSelectedRowKeys.splice(0, newSelectedRowKeys.length);
      newSelectedRowKeys.push(row[config.uniqueKey]);
    }

    setShowData(newShowData);
    setSelectedRows(newSelectedRows);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const unselectRow = (...rows: any[]) => {
    const newShowData: any[] = [...showData];
    const newSelectedRows: any[] = [...selectedRows];
    const newSelectedRowKeys: any[] = [...selectedRowKeys];

    if (config.multiple) {
      rows.forEach((row) => {
        const retVal = getRet(row, config);
        let index = newShowData.indexOf(retVal);
        if (index > -1) {
          newShowData.splice(index, 1);
        }
        index = newSelectedRowKeys.indexOf(row[config.uniqueKey]);

        if (index > -1) {
          newSelectedRows.splice(index, 1);
          newSelectedRowKeys.splice(index, 1);
        }
      });
    }
    // 单选处理
    else {
      newShowData.splice(0, newShowData.length);
      newSelectedRows.splice(0, newSelectedRows.length);
      newSelectedRowKeys.splice(0, newSelectedRowKeys.length);
    }

    setShowData(newShowData);
    setSelectedRows(newSelectedRows);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  useEffect(() => {
    // 初始 map 并配置 表格列数据
    const map: Record<string, number> = handlerColumns(columns, config);
    // 搜索列
    if (config.searchArray && config.searchArray.length > 0) {
      setProSearch(undefined);
      handlerSearch(columns, config, map);
    }
    setColumns([...columns]);
  }, [config.keyword]);

  useEffect(() => {
    setShowData(value ? [...value] : []);
  }, [value]);

  const style = { ...defaultModalStyle, ...modalStyle };
  return (
    <Modal
      style={style}
      width={style.width}
      {...modalProperties}
      bodyStyle={{ padding: '0px', ...modalProperties?.paddingTop }}
      title={title}
      visible={show}
      onCancel={() => {
        setShow(false);
      }}
      onOk={() => {
        if (config.multiple) {
          setValue([...showData]);
        } else {
          setValue(showData.length > 0 ? showData[0] : undefined);
        }
        setShow(false);
      }}
    >
      <Table
        actionRef={tableRef}
        options={false}
        defaultSize={'small'}
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
            if (selected) {
              selectRow(...changeRows);
            } else {
              unselectRow(...changeRows);
            }
          },
        }}
        postData={postData}
        tableAlertRender={false}
        columns={columns}
        request={(p) => {
          const option = {
            method: config.method,
          };
          option[config.position.toLowerCase()] = { ...p, ...config.fixedParams, ...dynamicParams };

          return request<R<PageResult<any>>>(config.url, option);
        }}
        tableExtraRender={() => {
          return (
            <Select
              value={showData}
              mode={'tags'}
              style={{
                width: '100%',
                paddingLeft: '24px',
                paddingRight: '24px',
                marginTop:
                  !config.searchArray || config.searchArray.length === 0 ? '15px' : undefined,
              }}
              open={false}
              onDeselect={(val: any) => {
                if (showData === undefined || showData === null) {
                  return;
                }

                // 不是多选.
                if (!config.multiple) {
                  // 相等, 处理
                  if (showData[0] === val) {
                    setShowData([]);
                    setSelectedRowKeys([]);
                    setSelectedRows([]);
                  }
                  return;
                }

                // 多选, 相等
                if (showData === val) {
                  // 清空选择内容
                  setShowData([]);
                  setSelectedRowKeys([]);
                  setSelectedRows([]);
                  return;
                }
                // 从选中内容中移除val
                let index = showData.indexOf(val);
                if (index !== -1) {
                  showData.splice(index, 1);
                  index = -1;
                  for (let i = 0; i < selectedRows.length; i += 1) {
                    const row = selectedRows[i];
                    if (getRet(row, config) === val) {
                      index = i;
                      break;
                    }
                  }
                  if (index !== -1) {
                    selectedRows.splice(index, 1);
                    selectedRowKeys.splice(index, 1);
                    setSelectedRowKeys([...selectedRows]);
                    setSelectedRowKeys([...selectedRowKeys]);
                  }

                  setShowData([...showData]);
                }
              }}
            />
          );
        }}
      />
    </Modal>
  );
};

export default LovModal;
