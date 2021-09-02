import { useRef } from 'react';
import type {
  SysDictItem,
  SysDictItemAttributes,
  SysDictItemQo,
  SysDictItemVo,
  SysDictVo,
} from '@/services/ballcat/system';
import type { ProColumns } from '@ant-design/pro-table';
import type { FormRef } from '@/components/LtForm';
import { ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import LtPage from '@/components/LtPage';
import { dictItem } from '@/services/ballcat/system';
import { Alert, Form, InputNumber, Modal, Popover, Tag } from 'antd';
import LtColor from '@/components/LtColor';
import { sysDictItemAttributesKeys } from '@/services/ballcat/system';
import ItemLanguages from './ItemLanguages';

const dataColumns: ProColumns<SysDictItemVo>[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 45,
  },
  {
    title: '字典标识',
    dataIndex: 'dictCode',
    copyable: true,
    ellipsis: true,
  },
  {
    title: '文本值',
    dataIndex: 'name',
  },
  {
    title: '数据值',
    dataIndex: 'value',
    copyable: true,
  },
  {
    title: '排序',
    dataIndex: 'sort',
    align: 'center',
    width: 45,
  },
  {
    title: '备注',
    dataIndex: 'remarks',
    ellipsis: true,
    width: 150,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 150,
  },
];

const tag_color_array = [
  'pink',
  'magenta',
  'red',
  'volcano',
  'orange',
  'gold',
  'lime',
  'green',
  'cyan',
  'blue',
  'geekblue',
  'purple',
  'success',
  'processing',
  'error',
  'warning',
];

export type ItemForm = {
  id: number;
  // 字典标识
  dictCode: string;
  // 数据值
  value: string;
  // 文本值
  name: string;
  // 排序（升序）
  sort: number;
  // 备注
  remarks: string;
  // 创建时间
  createTime: string;
  // 更新时间
  updateTime: string;
} & SysDictItemAttributes;

export type ItemProps = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  dictData: SysDictVo | undefined;
};

export default ({ visible, setVisible, dictData }: ItemProps) => {
  const modalRef = useRef<FormRef<ItemForm>>();

  return (
    <Modal
      title={`字典项: ${dictData?.title}`}
      bodyStyle={{ padding: '0' }}
      width={900}
      visible={visible}
      onCancel={() => {
        setVisible(false);
      }}
      footer={null}
    >
      {dictData === undefined ? (
        <Alert type="error" message="字典数据异常!" />
      ) : (
        <LtPage<SysDictItemVo, SysDictItemQo, ItemForm, SysDictItem>
          {...dictItem}
          rowKey="id"
          columns={dataColumns}
          toolBarActions={['create']}
          modalRef={modalRef}
          operateBar={[
            { type: 'edit', permission: 'system:dict:edit', props: { suffix: true } },
            { type: 'del', permission: 'system:dict:del' },
          ]}
          tableProps={{ search: false, params: { dictCode: dictData.code } }}
          formData={(data) => {
            return { ...data, ...data.attributes };
          }}
          handlerData={(body) => {
            const data: SysDictItem = { ...body, attributes: {} };

            sysDictItemAttributesKeys.forEach((key) => {
              data.attributes[key] = body[key];
            });

            return data;
          }}
        >
          <ProFormText name="id" hidden />
          <ProFormText
            label="标识"
            name="dictCode"
            placeholder="字典标识"
            disabled
            initialValue={dictData.code}
          />
          <ProFormText label="文本值" name="name" placeholder="文本值" />
          <ProFormText label="数据值" name="value" placeholder="数据值" />

          <Form.Item noStyle shouldUpdate>
            {(form) => {
              return (
                <>
                  <Form.Item label="文本颜色" name="textColor">
                    <LtColor>
                      <span style={{ color: form.getFieldValue('textColor') }}>颜色预览</span>
                    </LtColor>
                  </Form.Item>
                  <Form.Item label="标签颜色" name="tagColor">
                    <LtColor>
                      <Popover
                        trigger="click"
                        content={() =>
                          tag_color_array.map((tc) => (
                            <Tag
                              key={tc}
                              color={tc}
                              onClick={() => form.setFieldsValue({ tagColor: tc })}
                            >
                              {tc}
                            </Tag>
                          ))
                        }
                      >
                        <Tag color={form.getFieldValue('tagColor')}>切换预设</Tag>
                      </Popover>
                    </LtColor>
                  </Form.Item>

                  <Form.Item label="国际化" name="languages">
                    <ItemLanguages />
                  </Form.Item>

                  <Form.Item label="排序" name="sort">
                    <InputNumber style={{ width: '100%' }} />
                  </Form.Item>
                </>
              );
            }}
          </Form.Item>

          <ProFormTextArea label="备注" name="remarks" />
        </LtPage>
      )}
    </Modal>
  );
};
