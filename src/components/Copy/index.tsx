import I18n from '@/utils/I18nUtils';
import { CheckCircleTwoTone, CopyTwoTone } from '@ant-design/icons';
import type { CSSProperties } from 'react';
import { useState } from 'react';
// @ts-ignore
import CopyToClipboard from 'react-copy-to-clipboard';

type CopyProps = {
  value?: string;
} & CSSProperties;

export default ({ value, ...styles }: CopyProps) => {
  const [success, setSuccess] = useState(false);

  if (success) {
    return <CheckCircleTwoTone style={{ cursor: 'pointer', userSelect: 'none', ...styles }} />;
  }

  return (
    <CopyToClipboard
      text={value}
      onCopy={(text: string, result: boolean) => {
        if (result) {
          I18n.success('component.copy.success');
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
          }, 1500);
        } else {
          I18n.error('component.copy.failed');
        }
      }}
    >
      <CopyTwoTone style={{ userSelect: 'none', ...styles }} />
    </CopyToClipboard>
  );
};
