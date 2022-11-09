import { announcement } from '@/services/ballcat/notify';
import { NotificationOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import { history } from 'umi';
import { Token, User, login_uri, isLogin } from './Ballcat';
import I18n from './I18nUtils';

export type NotifyProps = { id: string; content: string; title: string };
let logoutModal: any;
let cleanCache: any = () => {};

const logoutHandler = () => {
  User.clean();
  logoutModal = undefined;
  cleanCache();
  const { pathname } = history.location;
  history.replace(`${login_uri}?redirect=${pathname}`);
};

const readNotice = (id: string) => {
  if (id && id.length > 0) {
    // 非预览. 发已读请求
    announcement.readAnnouncement(id);
  }
};

const Notify = {
  setCleanCache: (clean: any) => {
    cleanCache = clean;
  },
  preview: (props: NotifyProps) => {
    Notify.notice({ ...props, id: '' });
  },
  notice: ({ id, content, title }: NotifyProps) => {
    Modal.info({
      title,
      content: <div dangerouslySetInnerHTML={{ __html: content }} />,
      width: 800,
      icon: (
        <NotificationOutlined
          style={{ color: '#1890ff', fontSize: '22px', marginRight: '16px', float: 'left' }}
        />
      ),
      keyboard: false,
      closable: false,
      onOk: () => readNotice(id),
      onCancel: () => readNotice(id),
    });
  },
  logout: () => {
    // 未登录页不提示
    if (!isLogin() || logoutModal !== undefined) {
      return;
    }

    // 如果没有缓存过token - 未登录过.
    if (!Token.get()) {
      // 直接跳转到登录页
      logoutHandler();
      return;
    }
    Token.clean();
    Modal.destroyAll();

    logoutModal = Modal.info({
      title: I18n.text('notify.logout.title'),
      content: I18n.text('notify.logout.content'),
      closable: false,
      keyboard: false,
      okText: I18n.text('notify.logout.okText'),
      onOk: () => logoutHandler(),
      onCancel: () => logoutHandler(),
      zIndex: 99999999,
    });
  },
};

export default Notify;
