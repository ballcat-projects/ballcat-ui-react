import Page from '@/components/Page';
import type { SysI18nDto, SysI18nLanguage, SysI18nQo, SysI18nVo } from '@/services/ballcat/system';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ModalForm } from '@ant-design/pro-form';
import { ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { i18n } from '@/services/ballcat/system';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, Form, message, Radio, Upload } from 'antd';
import type { FormStatus } from '@/components/Form';
import { useState, useRef } from 'react';
import Icon from '@/components/Icon';
import SysI18nCreate from '@/pages/i18n/SysI18nCreate';
import FileUtils from '@/utils/FileUtils';
import type { UploadFile } from 'antd/lib/upload/interface';

const dataColumns: ProColumns<SysI18nVo>[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 90,
    hideInSearch: true,
  },
  {
    title: '语言标签',
    dataIndex: 'languageTag',
    width: 80,
    order: 97,
  },
  {
    title: '国际化标识',
    dataIndex: 'code',
    width: 200,
    ellipsis: true,
    order: 99,
  },
  {
    title: '文本值',
    dataIndex: 'message',
    width: 200,
    ellipsis: true,
    order: 98,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    ellipsis: true,
    hideInSearch: true,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: '150px',
    sorter: true,
    hideInSearch: true,
  },
];

export default () => {
  const tableFormRef = useRef<ProFormInstance<SysI18nQo>>();
  const tableRef = useRef<ActionType>();
  const importFormRef = useRef<ProFormInstance<any>>();

  const [status, setStatus] = useState<FormStatus>(undefined);
  const [exportLoading, setExportLoading] = useState(false);
  const [importVisible, setImportVisible] = useState(false);
  const [importLoading, setImportLoading] = useState(false);

  return (
    <>
      <Page.Modal<SysI18nVo, SysI18nQo, SysI18nDto>
        {...i18n}
        title="国际化信息"
        rowKey="id"
        columns={dataColumns}
        tableRef={tableRef}
        toolBarActions={[
          <Button
            loading={exportLoading}
            onClick={() => {
              setExportLoading(true);
              const searchValues = tableFormRef.current?.getFieldsValue();
              const queryParams = {};
              if (searchValues) {
                Object.keys(searchValues).forEach((k) => {
                  const v = searchValues[k];
                  if (v !== undefined && v !== null) {
                    queryParams[k] = v;
                  }
                });
              }

              i18n
                .exportExcel(queryParams as SysI18nQo)
                .then((response) => {
                  FileUtils.remoteFileDownload(response, `国际化信息.xlsx`);
                })
                .finally(() => setExportLoading(false));
            }}
          >
            <Icon type="download" /> 导出
          </Button>,
          <Button loading={importLoading} onClick={() => setImportVisible(true)}>
            <Icon type="upload" /> 导入
          </Button>,
          { type: 'create', permission: 'i18n:i18n-data:add' },
        ]}
        operateBar={[
          { type: 'edit', permission: 'i18n:i18n-data:edit' },
          { type: 'del', permission: 'i18n:i18n-data:del' },
        ]}
        modalProps={{ titleSuffix: '国际化信息' }}
        tableProps={{ formRef: tableFormRef }}
        onStatusChange={setStatus}
      >
        <ProFormText name="id" hidden />

        <ProFormText
          name="code"
          label="国际化标识"
          disabled={status === 'edit'}
          rules={[{ required: true, message: '请输入国际化标识!' }]}
        />

        <Form.Item noStyle shouldUpdate>
          {(form) => {
            return (
              <>
                {status === 'edit' ? (
                  <></>
                ) : (
                  <Form.Item
                    name="languageTexts"
                    label="国际化文本"
                    rules={[
                      { required: true, message: '至少填写一种语言的文本!' },
                      () => {
                        return {
                          validator: (rule, val) => {
                            let msg: string = '';
                            if (!val || !(val instanceof Array) || val.length === 0) {
                              msg = '至少填写一种语言的文本!';
                            } else {
                              const array = val as SysI18nLanguage[];

                              for (let index = 0; index < array.length; index += 1) {
                                const item = array[index];
                                if (!item.message || item.message.length === 0) {
                                  msg = `${item.languageTag} 语言的文本不能为空!`;
                                  break;
                                }
                              }
                            }

                            if (msg && msg.length > 0) {
                              return Promise.reject(msg);
                            }

                            return Promise.resolve();
                          },
                        };
                      },
                    ]}
                  >
                    <SysI18nCreate code={form.getFieldValue('code')} />
                  </Form.Item>
                )}
              </>
            );
          }}
        </Form.Item>

        {status !== 'edit' ? (
          <></>
        ) : (
          <>
            <ProFormText disabled name="languageTag" label="语言标签" />

            <ProFormText
              name="message"
              label="文本值"
              rules={[{ required: true, message: '文本值不能为空!' }]}
            />
          </>
        )}

        <ProFormTextArea name="remark" label="备注" />
      </Page.Modal>

      <ModalForm
        title="批量导入：国际化信息"
        visible={importVisible}
        modalProps={{ confirmLoading: importLoading }}
        formRef={importFormRef}
        onVisibleChange={setImportVisible}
        onFinish={async (data: { file: UploadFile[]; importMode: string }) => {
          setImportLoading(true);
          const { file, importMode } = data;

          const fd = new FormData();
          // @ts-ignore
          fd.append('file', file[0].originFileObj);
          fd.append('importMode', importMode);

          i18n
            .importExcel(fd)
            .then(() => {
              message.success('导入成功!');
              setImportVisible(false);
              tableRef.current?.reload();
              importFormRef.current?.resetFields();
            })
            .finally(() => setImportLoading(false));
        }}
      >
        <Form.Item
          name="file"
          valuePropName="fileList"
          getValueFromEvent={(e: { fileList: UploadFile[] }) => {
            return e && e.fileList;
          }}
          rules={[{ required: true, message: '请选择一个文件!' }]}
        >
          <Upload accept=".xls,.xlsx" maxCount={1}>
            <Button loading={importLoading} onClick={() => setImportVisible(true)}>
              <Icon type="upload" />
              选择文件
            </Button>

            <a
              style={{ marginLeft: '12px' }}
              onClick={(e) => {
                e.stopPropagation();
                i18n.downloadTemplate().then((blob) => {
                  FileUtils.remoteFileDownload(blob, '国际化信息模板.xlsx');
                });
              }}
            >
              下载模板文件
            </a>
          </Upload>
        </Form.Item>

        <Form.Item name="importMode" label="当数据已存在时:" initialValue="SKIP_EXISTING">
          <Radio.Group
            optionType="button"
            options={[
              { label: '跳过已有', value: 'SKIP_EXISTING' },
              { label: '覆盖已有', value: 'OVERWRITE_EXISTING' },
            ]}
          />
        </Form.Item>
      </ModalForm>
    </>
  );
};
