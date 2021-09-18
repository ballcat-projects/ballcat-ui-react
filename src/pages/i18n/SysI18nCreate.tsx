import { useState, useEffect } from 'react';
import { Button, Input, Popover, Transfer } from 'antd';
import { transferTags } from '@/utils/languages';
import type { SysI18nLanguage } from '@/services/ballcat/system';
import Icon from '@/components/Icon';

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
        array.push(val);
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
              nd[item] = { code, message: e.target.value, languageTag: item };
              setI18nData(nd);
              sync(item, nd[item]);
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
          <Icon type="plus" />
          添加语言
        </Button>
      </Popover>
    </>
  );
};

export default SysI18nCreate;
