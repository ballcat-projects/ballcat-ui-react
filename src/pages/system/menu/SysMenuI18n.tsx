import { useState, useEffect } from 'react';
import { Input } from 'antd';
import languages from '@/utils/languages';
import type { SysMenuI18n } from '@/services/ballcat/system';

export type SysMenuI18nProps = {
  code: string;
  value?: SysMenuI18n[];
  onChange?: (value: SysMenuI18n[]) => void;
};

const toList = (zhCn: SysMenuI18n | undefined, enUs: SysMenuI18n | undefined) => {
  const res: SysMenuI18n[] = [];

  if (zhCn && zhCn.message && zhCn.message.length > 0) {
    res.push(zhCn);
  }

  if (enUs && enUs.message && enUs.message.length > 0) {
    res.push(enUs);
  }

  return res;
};

const SysMenuI18nForm = (props: SysMenuI18nProps) => {
  const { code, value, onChange = () => {} } = props;
  const [zhCN, setZhCN] = useState<SysMenuI18n | undefined>(undefined);
  const [enUS, setEnUS] = useState<SysMenuI18n | undefined>(undefined);

  useEffect(() => {
    if (!value || value.length === 0) {
      setZhCN(undefined);
      setEnUS(undefined);
    } else {
      value.forEach((item) => {
        if (item.languageTag === 'zh-CN') {
          setZhCN(item);
        } else {
          setEnUS(item);
        }
      });
    }
  }, [code, value]);

  return (
    <>
      <Input
        key="sys-menu-i18n-zh-CN"
        addonBefore={languages['zh-CN'].label}
        style={{ marginBottom: 5 }}
        defaultValue={zhCN && zhCN.message}
        onChange={(e) => {
          const val = { code, message: e.target.value, languageTag: 'zh-CN' };
          setZhCN(val);
          onChange(toList(val, enUS));
        }}
      />
      <Input
        key="sys-menu-i18n-en-US"
        addonBefore={languages['en-US'].label}
        style={{ marginBottom: 5 }}
        defaultValue={enUS && enUS.message}
        onChange={(e) => {
          const val = { code, message: e.target.value, languageTag: 'en-US' };
          setEnUS(val);
          onChange(toList(zhCN, val));
        }}
      />
    </>
  );
};

export default SysMenuI18nForm;
