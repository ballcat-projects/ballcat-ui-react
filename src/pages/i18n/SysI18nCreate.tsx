import { useEffect, useState } from 'react';
import { Button, Input, Popover, Transfer } from 'antd';
import { transferTags } from '@/config/languages';
import type { SysI18nLanguage } from '@/services/ballcat/system';
import { PlusOutlined } from '@ant-design/icons';

const defaultTags = ['zh-CN', 'en-US'];

export type SysI18nCreateProps = {
  code: string;
  value?: SysI18nLanguage[];
  onChange?: (value: SysI18nLanguage[]) => void;
};

const SysI18nCreate = (props: SysI18nCreateProps) => {
  const { code, value, onChange = () => {} } = props;
  const [tags, setTags] = useState<string[]>(defaultTags);
  const [i18nData, setI18nData] = useState<Record<string, SysI18nLanguage>>({});

  const sync = (tag: string, val: SysI18nLanguage) => {
    const array: SysI18nLanguage[] = [];

    tags.forEach((t) => {
      if (t === tag) {
        if (val) {
          array.push(val);
        }
      } else if (i18nData[t]) {
        array.push(i18nData[t]);
      }
    });

    onChange(array);
  };

  useEffect(() => {
    if (!value || value.length === 0) {
      setI18nData({});
    } else {
      const nd = {};
      const nt: string[] = [...tags];

      value.forEach((item) => {
        nd[item.languageTag] = item;
        if (nt.indexOf(item.languageTag) === -1) {
          nt.push(item.languageTag);
        }
      });

      setI18nData(nd);
      setTags(nt);
    }
  }, [code, value]);

  return (
    <>
      {tags.map((item) => {
        return (
          <Input
            key={`i18n-create-${item}`}
            addonBefore={item}
            style={{ marginBottom: 5 }}
            defaultValue={i18nData[item] ? i18nData[item].message : undefined}
            onChange={(e) => {
              const nd = { ...i18nData };
              const message = e.target.value;

              if (message && message.length > 0) {
                nd[item] = { code, message, languageTag: item };
              } else {
                // 无效语言文本
                delete nd[item];
              }

              sync(item, nd[item]);
              setI18nData(nd);
            }}
          />
        );
      })}

      <Popover
        trigger="click"
        content={
          <Transfer
            dataSource={transferTags}
            targetKeys={tags}
            render={(item) => item.title || ''}
            onChange={(keys) => {
              setTags(keys.reverse());
            }}
          />
        }
      >
        <Button type="dashed" style={{ width: '100%' }}>
          <PlusOutlined />
          添加语言
        </Button>
      </Popover>
    </>
  );
};

export default SysI18nCreate;
