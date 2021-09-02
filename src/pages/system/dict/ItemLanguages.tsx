import { useState } from 'react';
import { Input } from 'antd';
import languages from '@/utils/languages';
import React from 'react';

export type ItemLanguagesProps = {
  value?: string;
  onChange?: (value: string) => void;
};

const ItemLanguages = (props: ItemLanguagesProps) => {
  const { value, onChange = () => {} } = props;
  const [json, setJson] = useState<Record<string, string>>(value ? JSON.parse(value) : {});
  const dom: React.ReactNode[] = [];

  Object.keys(languages).forEach((key) => {
    const lang = languages[key];
    dom.push(
      <Input
        key={`sys-dict-item-languages-${lang.label}`}
        addonBefore={lang.label}
        defaultValue={json[lang.lang]}
        onChange={(e) => {
          const val = e.target.value;
          const nj = { ...json };
          nj[lang.lang] = val;
          setJson(nj);
          onChange(JSON.stringify(nj));
        }}
        style={{ marginBottom: 5 }}
      />,
    );
  });

  return <>{dom}</>;
};

export default ItemLanguages;
