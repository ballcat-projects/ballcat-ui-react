import { DictTag } from '@/components/Dict';
import LtTable from '@/components/LtTable';
import type { OperationLogQo, OperationLogVo } from '@/services/ballcat/log';
import { operation } from '@/services/ballcat/log';
import type { ProColumns } from '@ant-design/pro-table';
import { Typography } from 'antd';

const dataColumns: ProColumns<OperationLogVo>[] = [
  {
    title: '追踪ID',
    dataIndex: 'traceId',
    width: 205,
  },
  {
    title: '日志消息',
    dataIndex: 'msg',
    ellipsis: true,
    width: 120,
  },
  {
    title: '类型',
    dataIndex: 'type',
    align: 'center',
    width: 50,
    hideInSearch: true,
    render: (dom, record) => <DictTag code="operation_type" value={record.type} />,
  },
  {
    title: '请求IP',
    dataIndex: 'ip',
    width: 120,
  },
  {
    title: '请求URI',
    dataIndex: 'uri',
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
    title: '操作人',
    hideInSearch: true,
    dataIndex: 'operator',
    width: 120,
    ellipsis: true,
  },
  {
    title: '状态',
    hideInSearch: true,
    dataIndex: 'status',
    width: 50,
    render: (dom, record) => <DictTag code="log_status" value={record.status} />,
  },
  {
    title: '创建时间',
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
    <LtTable<OperationLogVo, OperationLogQo>
      headerTitle="登陆日志"
      rowKey="id"
      request={operation.query}
      columns={dataColumns}
      expandable={{
        rowExpandable: () => true,
        expandedRowRender: (record) => {
          return (
            <>
              <Typography>
                <Typography.Title level={5}>params:</Typography.Title>
                <Typography.Paragraph>{record.params}</Typography.Paragraph>
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
