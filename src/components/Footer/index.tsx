import { useIntl } from 'umi';
import { CopyrightOutlined, GithubOutlined } from '@ant-design/icons';
import GlobalFooter from '@ant-design/pro-layout/lib/components/GlobalFooter';
import { Fragment } from 'react';

export default () => {
  const intl = useIntl();
  const defaultMessage = intl.formatMessage({
    id: 'app.copyright.produced',
  });

  return (
    <GlobalFooter
      style={{ marginTop: 0, marginBottom: 0 }}
      links={[
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/ballcat-projects/ballcat-ui-react/',
          blankTarget: true,
        },
      ]}
      copyright={
        <Fragment>
          <CopyrightOutlined /> `2021 ${defaultMessage}`
        </Fragment>
      }
    />
  );
};
