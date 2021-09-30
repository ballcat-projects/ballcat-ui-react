import LtTable from '@/components/LtTable';
import type { AccessLogQo, AccessLogVo } from '@/services/ballcat/log';
import { access } from '@/services/ballcat/log';
import type { ProColumns } from '@ant-design/pro-table';
import { Typography } from 'antd';

const dataColumns: ProColumns<AccessLogVo>[] = [
  {
    title: '追踪ID',
    dataIndex: 'traceId',
    width: 205,
  },
  {
    title: '用户名',
    dataIndex: 'username',
    ellipsis: true,
    width: 120,
    hideInSearch: true,
  },
  {
    title: '请求IP',
    dataIndex: 'ip',
    width: 120,
  },
  {
    title: '请求URI',
    dataIndex: 'uri',
    width: 200,
    ellipsis: true,
  },
  {
    title: '方法',
    width: 80,
    hideInSearch: true,
    dataIndex: 'method',
  },
  {
    title: '耗时',
    hideInSearch: true,
    dataIndex: 'time',
    width: 100,
    renderText: (text) => `${text}ms`,
  },
  {
    title: '状态码',
    dataIndex: 'httpStatus',
    width: 60,
  },
  {
    title: '错误消息',
    dataIndex: 'errorMsg',
    ellipsis: true,
    hideInSearch: true,
  },
  {
    title: '访问时间',
    hideInSearch: true,
    dataIndex: 'createTime',
    width: 150,
    sorter: true,
  },
  {
    title: '访问时间',
    dataIndex: 'operateTime',
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
    <LtTable<AccessLogVo, AccessLogQo>
      headerTitle="访问日志"
      rowKey="id"
      request={access.query}
      columns={dataColumns}
      expandable={{
        rowExpandable: () => true,
        expandedRowRender: (record) => {
          return (
            <>
              <Typography>
                <Typography.Title level={5}>reqParams:</Typography.Title>
                <Typography.Paragraph>{record.reqParams}</Typography.Paragraph>
                <Typography.Title level={5}>reqBody:</Typography.Title>
                <Typography.Paragraph>{record.reqBody}</Typography.Paragraph>
                <Typography.Title level={5}>result:</Typography.Title>
                <Typography.Paragraph>{record.result}</Typography.Paragraph>
                <Typography.Title level={5}>userAgent:</Typography.Title>
                <Typography.Paragraph>{record.userAgent}</Typography.Paragraph>
              </Typography>
            </>
          );
        },
      }}
    />
  );
};
