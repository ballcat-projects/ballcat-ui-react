import {
  AlipayCircleOutlined,
  LockOutlined,
  MobileOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import { Alert, message, Space, Tabs } from 'antd';
import React, { useState } from 'react';
import ProForm, { ProFormCaptcha, ProFormCheckbox, ProFormText } from '@ant-design/pro-form';
import { history, Link, SelectLang, useIntl, useModel } from 'umi';
import { login } from '@/services/ant-design-pro/api';
import { getFakeCaptcha } from '@/services/ant-design-pro/login';
import { pwd } from '@/utils/Encrypt';
import VerifySlide from '@/components/Captcha';
import { User, Token } from '@/utils/Ballcat';
import { settings } from '@/utils/ConfigUtils';
import I18n from '@/utils/I18nUtils';

// @ts-ignore
import styles from './index.less';
import { useAliveController } from 'react-activation';

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const [type, setType] = useState<string>('account');
  // 是否使用登录验证码
  const [captcha] = useState<boolean>(true);
  const [captchaSow, setCaptchaSow] = useState<boolean>(false);
  const [vs, setVs] = useState<VerifySlide>();
  const [loginParams, setLoginParams] = useState<API.LoginParams>({});
  const { initialState, setInitialState, refresh } = useModel('@@initialState');
  const { clear } = useAliveController();

  I18n.setIntl(useIntl());

  /**
   * 登录请求处理
   */
  const loginHandler = async (values: API.LoginParams) => {
    setSubmitting(true);
    // 登录
    return login({ ...values, type, password: pwd.encrypt(`${values.password}`) })
      .then(async (res) => {
        // 解析远程数据
        const remoteUser = {
          ...res,
          roles: res.attributes.roleCodes,
          permissions: res.attributes.permissions,
        };
        // 清空现有的tab缓存
        clear();
        I18n.success('pages.login.success');
        // 缓存用户信息
        User.set(JSON.stringify(remoteUser));
        // 缓存token
        Token.set(remoteUser.access_token);
        // @ts-ignore
        setInitialState({ ...initialState, user: remoteUser });

        if (!history) return;

        const { query } = history.location;
        const { redirect } = query as { redirect: string };
        let url: string;
        /** 跳转到 redirect 参数所在的位置 */
        if (settings.historyType === 'hash') {
          // 如果是hash 则刷新数据
          await refresh();
          url = redirect ? `/#${redirect}` : '/';
        } else {
          url = redirect || '/';
        }
        setTimeout(() => {
          window.location.href = url;
        }, 500);
      })
      .catch(() => {
        I18n.error('pages.login.failure');
        // 如果失败去设置用户错误信息
        setUserLoginState({ status: 'error', type });
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  /**
   * 登录处理
   */
  const handleSubmit = async (values: API.LoginParams) => {
    if (captcha) {
      if (!vs) {
        I18n.error('pages.login.module.failure');
        return;
      }
      // 弹出验证码框
      setCaptchaSow(true);
      vs.refresh();
    } else {
      await loginHandler(values);
    }
  };

  const { status, type: loginType } = userLoginState;

  return (
    <div className={styles.container}>
      <div hidden={!settings.i18n} className={styles.lang} data-lang>
        {SelectLang && <SelectLang />}
      </div>
      <VerifySlide
        // @ts-ignore
        ref={setVs}
        isSlideShow={captchaSow}
        close={() => {
          setCaptchaSow(false);
        }}
        success={async (captchaVerification) => {
          await loginHandler({ ...loginParams, captchaVerification });
        }}
      />
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <Link to="/">
              <img alt="logo" className={styles.logo} src="/logo.svg" />
              <span className={styles.title}>Ball Cat</span>
            </Link>
          </div>
          <div className={styles.desc}>{I18n.text('pages.layouts.userLayout.title')}</div>
        </div>

        <div className={styles.main}>
          <ProForm
            initialValues={{
              autoLogin: true,
            }}
            submitter={{
              searchConfig: {
                submitText: I18n.text('pages.login.submit'),
              },
              render: (_, dom) => dom.pop(),
              submitButtonProps: {
                loading: submitting,
                size: 'large',
                style: {
                  width: '100%',
                },
              },
            }}
            onFinish={async (values) => {
              setLoginParams(values);
              await handleSubmit(values as API.LoginParams);
            }}
          >
            <Tabs activeKey={type} onChange={setType}>
              <Tabs.TabPane key="account" tab={I18n.text('pages.login.accountLogin.tab')} />
              <Tabs.TabPane key="mobile" tab={I18n.text('pages.login.phoneLogin.tab')} />
            </Tabs>

            {status === 'error' && loginType === 'account' && (
              <LoginMessage content={I18n.text('pages.login.accountLogin.errorMessage')} />
            )}
            {type === 'account' && (
              <>
                <ProFormText
                  name="username"
                  fieldProps={{
                    size: 'large',
                    prefix: <UserOutlined className={styles.prefixIcon} />,
                  }}
                  placeholder={I18n.text('pages.login.username.placeholder')}
                  rules={[
                    {
                      required: true,
                      message: I18n.text('pages.login.username.required'),
                    },
                  ]}
                />
                <ProFormText.Password
                  name="password"
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined className={styles.prefixIcon} />,
                  }}
                  placeholder={I18n.text('pages.login.password.placeholder')}
                  rules={[
                    {
                      required: true,
                      message: I18n.text('pages.login.password.required'),
                    },
                  ]}
                />
              </>
            )}

            {status === 'error' && loginType === 'mobile' && <LoginMessage content="验证码错误" />}
            {type === 'mobile' && (
              <>
                <ProFormText
                  fieldProps={{
                    size: 'large',
                    prefix: <MobileOutlined className={styles.prefixIcon} />,
                  }}
                  name="mobile"
                  placeholder={I18n.text('pages.login.phoneNumber.placeholder')}
                  rules={[
                    {
                      required: true,
                      message: I18n.text('pages.login.phoneNumber.required'),
                    },
                    {
                      pattern: /^1\d{10}$/,
                      message: I18n.text('pages.login.phoneNumber.invalid'),
                    },
                  ]}
                />
                <ProFormCaptcha
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined className={styles.prefixIcon} />,
                  }}
                  captchaProps={{
                    size: 'large',
                  }}
                  placeholder={I18n.text('pages.login.captcha.placeholder')}
                  captchaTextRender={(timing, count) => {
                    if (timing) {
                      return `${count} ${I18n.text('pages.getCaptchaSecondText')}`;
                    }
                    return I18n.text('pages.login.phoneLogin.getVerificationCode');
                  }}
                  name="captcha"
                  rules={[
                    {
                      required: true,
                      message: I18n.text('pages.login.captcha.required'),
                    },
                  ]}
                  onGetCaptcha={async (phone) => {
                    const result = await getFakeCaptcha({
                      phone,
                    });
                    if (result === false) {
                      return;
                    }
                    message.success('获取验证码成功！验证码为：1234');
                  }}
                />
              </>
            )}
            <div
              style={{
                marginBottom: 24,
              }}
            >
              <ProFormCheckbox noStyle name="autoLogin">
                {I18n.text('pages.login.rememberMe')}
              </ProFormCheckbox>
              <a
                style={{
                  float: 'right',
                }}
              >
                {I18n.text('pages.login.forgotPassword')}
              </a>
            </div>
          </ProForm>
          <Space className={styles.other}>
            {I18n.text('pages.login.loginWith')}
            <AlipayCircleOutlined className={styles.icon} />
            <TaobaoCircleOutlined className={styles.icon} />
            <WeiboCircleOutlined className={styles.icon} />
          </Space>
        </div>
      </div>
    </div>
  );
};

export default Login;
