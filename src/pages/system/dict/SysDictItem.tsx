import type {
  SysDictItem,
  SysDictItemAttributes,
  SysDictItemQo,
  SysDictItemVo,
  SysDictVo,
} from '@/services/ballcat/system';
import { badgeStatusArray } from '@/services/ballcat/system';
import { badgeDefaultColorArray } from '@/services/ballcat/system';
import { tagDefaultColorArray } from '@/services/ballcat/system';
import type { ProColumns } from '@ant-design/pro-table';
import { ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import Page from '@/components/Page';
import { dictItem } from '@/services/ballcat/system';
import { Alert, Badge, Form, InputNumber, Modal, Popover, Tag, Select } from 'antd';
import Color from '@/components/Color';
import { sysDictItemAttributesKeys } from '@/services/ballcat/system';
import ItemLanguages from './ItemLanguages';
import FormGroup from '@/components/Form/FormGroup';

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
        <Page.Modal<SysDictItemVo, SysDictItemQo, ItemForm, SysDictItem>
          {...dictItem}
          rowKey="id"
          columns={dataColumns}
          toolBarActions={[{ type: 'create', permission: 'system:dict:edit' }]}
          operateBar={[
            { type: 'edit', permission: 'system:dict:edit' },
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
                  <FormGroup>
                    <Form.Item label="文本颜色" name="textColor">
                      <Color>
                        <span style={{ color: form.getFieldValue('textColor') }}>颜色预览</span>
                      </Color>
                    </Form.Item>
                    <Form.Item label="标签颜色" name="tagColor">
                      <Color>
                        <Popover
                          trigger="click"
                          content={() =>
                            tagDefaultColorArray.map((tc) => (
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
                      </Color>
                    </Form.Item>
                  </FormGroup>

                  <FormGroup>
                    <Form.Item label="徽标颜色" name="badgeColor">
                      <Color>
                        <Popover
                          trigger="click"
                          content={() =>
                            badgeDefaultColorArray.map((tc) => (
                              <a
                                style={{ marginRight: '5px' }}
                                onClick={() => form.setFieldsValue({ badgeColor: tc })}
                              >
                                <Badge color={tc} text={tc} />
                              </a>
                            ))
                          }
                        >
                          <Badge
                            text="切换预设"
                            color={form.getFieldValue('badgeColor')}
                            status={form.getFieldValue('badgeStatus')}
                          />
                        </Popover>
                      </Color>
                    </Form.Item>

                    <Form.Item label="徽标状态" name="badgeStatus" initialValue="default">
                      <Select>
                        {badgeStatusArray.map((bs) => (
                          <Select.Option key={bs} value={bs}>
                            <Badge
                              text={bs}
                              // @ts-ignore
                              status={bs}
                            />
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </FormGroup>
                </>
              );
            }}
          </Form.Item>

          <Form.Item label="国际化" name="languages">
            <ItemLanguages />
          </Form.Item>

          <Form.Item label="排序" name="sort">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <ProFormTextArea label="备注" name="remarks" />
        </Page.Modal>
      )}
    </Modal>
  );
};
