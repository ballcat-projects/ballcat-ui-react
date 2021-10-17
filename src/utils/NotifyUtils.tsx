import { Modal } from 'antd';
import { announcement } from '@/services/ballcat/notify';
import { NotificationOutlined } from '@ant-design/icons';

export type NotifyProps = { id: string; content: string; title: string };

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
};

export default Notify;
