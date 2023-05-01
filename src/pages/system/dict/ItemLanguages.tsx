import { useEffect, useState } from 'react';
import { Input } from 'antd';
import languages, { allTag } from '@/config/languages';

export type ItemLanguagesProps = {
  value?: string | Record<string, string>;
  onChange?: (value: string | Record<string, string>) => void;
};

const ItemLanguages = (props: ItemLanguagesProps) => {
  const { value, onChange = () => {} } = props;
  const [json, setJson] = useState<Record<string, string>>({});

  useEffect(() => {
    let nv = {};
    if (value) {
      nv = typeof value === 'string' ? JSON.parse(value) : { ...value };
    }
    setJson(nv);
  }, [value]);

  return (
    <>
      {allTag.map((key) => {
        const lang = languages[key];
        return (
          <Input
            key={`sys-dict-item-languages-${lang.label}`}
            addonBefore={lang.label}
            value={json[lang.lang]}
            onChange={(e) => {
              const val = e.target.value;
              const nj = { ...json };
              nj[lang.lang] = val;
              setJson(nj);
              onChange(nj);
            }}
            style={{ marginBottom: 5 }}
          />
        );
      })}
    </>
  );
};

export default ItemLanguages;
