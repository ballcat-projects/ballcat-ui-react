import I18n from '@/utils/I18nUtils';
import { CheckOutlined, CopyTwoTone } from '@ant-design/icons';
import type { CSSProperties } from '@umijs/renderer-react/node_modules/@types/react';
import React, { useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

type CopyProps = {
  value?: string;
} & CSSProperties;

export default ({ value, ...iconProps }: CopyProps) => {
  const [success, setSuccess] = useState(false);

  return (
    <CopyToClipboard
      text={value}
      onCopy={(text, result) => {
        if (result) {
          I18n.success('copy.success');
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
          }, 1500);
        } else {
          I18n.success('copy.failed');
        }
      }}
    >
      {success ? (
        <CheckOutlined style={{ color: 'green', ...iconProps }} />
      ) : (
        <CopyTwoTone style={{ cursor: 'pointer', ...iconProps }} />
      )}
    </CopyToClipboard>
  );
};
