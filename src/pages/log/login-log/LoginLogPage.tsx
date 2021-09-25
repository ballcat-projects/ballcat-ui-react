import { DictSelect, DictTag } from '@/components/Dict';
import LtTable from '@/components/LtTable';
import type { LoginLogQo, LoginLogVo } from '@/services/ballcat/log';
import { login } from '@/services/ballcat/log';
import type { ProColumns } from '@ant-design/pro-table';

const dataColumns: ProColumns<LoginLogVo>[] = [
  {
    title: '追踪ID',
    dataIndex: 'traceId',
    width: 195,
  },
  {
    title: '用户名',
    dataIndex: 'username',
    width: 80,
    copyable: true,
    ellipsis: true,
  },
  {
    title: '事件',
    dataIndex: 'eventType',
    align: 'center',
    width: 60,
    render: (dom, record) => <DictTag code="login_event_type" value={record.eventType} />,
    renderFormItem: () => <DictSelect allowClear code="login_event_type" />,
  },
  {
    title: '登陆IP',
    dataIndex: 'ip',
    width: 120,
  },
  {
    title: '浏览器',
    hideInSearch: true,
    dataIndex: 'browser',
    width: 100,
    ellipsis: true,
  },
  {
    title: '操作系统',
    hideInSearch: true,
    dataIndex: 'os',
    width: 110,
    ellipsis: true,
  },
  {
    title: '操作信息',
    hideInSearch: true,
    dataIndex: 'msg',
    ellipsis: true,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 50,
    render: (dom, record) => <DictTag code="log_status" value={record.status} />,
    renderFormItem: () => <DictSelect allowClear code="log_status" />,
  },
  {
    title: '登录/登出时间',
    hideInSearch: true,
    dataIndex: 'loginTime',
    width: 150,
    sorter: true,
  },
  {
    title: '登陆时间',
    dataIndex: 'loginTime',
    hideInTable: true,
    valueType: 'dateTimeRange',
    search: {
      transform: (val) => ({
        startTime: val[0],
        endTime: val[1],
      }),
    },
  },
];

export default () => {
  return (
    <LtTable<LoginLogVo, LoginLogQo>
      headerTitle="登陆日志"
      rowKey="id"
      request={login.query}
      columns={dataColumns}
    />
  );
};
