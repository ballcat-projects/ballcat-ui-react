import { Modal } from 'antd';
import { announcement } from '@/services/ballcat/notify';
import { NotificationOutlined } from '@ant-design/icons';
import RouteUtils from './RouteUtils';
import I18n from './I18nUtils';
import { history } from 'umi';
import { Token, User } from './Ballcat';

export type NotifyProps = { id: string; content: string; title: string };

const logoutHandler = () => {
  Modal.destroyAll();
  User.clean();
  Token.clean();
  RouteUtils.redirect('/user/login');
};

const readNotice = (id: string) => {
  if (id && id.length > 0) {
    // 非预览. 发已读请求
    announcement.readAnnouncement(id);
  }
};

const Notify = {
  preview: (props: NotifyProps) => {
    Notify.notice({ ...props, id: '' });
  },
  notice: ({ id, content, title }: NotifyProps) => {
    Modal.info({
      title,
      content: <div dangerouslySetInnerHTML={{ __html: content }}></div>,
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
    // 登录页不提示
    if (history.location.pathname === '/user/login') {
      return;
    }

    // 如果没有缓存过token - 未登录过.
    if (!Token.get()) {
      // 直接跳转到登录页
      logoutHandler();
      return;
    }

    Modal.info({
      title: I18n.text('notify.logout.title'),
      content: I18n.text('notify.logout.content'),
      closable: false,
      keyboard: false,
      okText: I18n.text('notify.logout.okText'),
      onOk: () => logoutHandler(),
      onCancel: () => logoutHandler(),
    });
  },
};

export default Notify;
