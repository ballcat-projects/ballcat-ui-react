import type { PageOperateBar, PageToolBarActions } from '.';
import React from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import type { FormStatus, ModalFormRef } from '@/components/Form';
import Auth from '@/components/Auth';
import I18n from '@/utils/I18nUtils';
import { defautlTitle } from '@/components/Form/ModalForm';
import type { R } from '@/typings';

type PSC<T> = (st: FormStatus, record?: T) => boolean | void;

export default {
  generateToolBarActionsList<T, E>(
    perStatusChange: PSC<T>,
    formRef: React.MutableRefObject<ModalFormRef<E> | undefined>,
    actions?: PageToolBarActions[],
  ) {
    if (actions && actions.length > 0) {
      const tbList: React.ReactNode[] = [];
      actions.forEach((tb) => {
        if (!React.isValidElement(tb)) {
          tbList.push(
            <Auth.Button
              domKey="page-tool-bar-action-create"
              type="primary"
              icon="plus"
              // @ts-ignore
              permission={tb.permission}
              text={defautlTitle.create}
              onClick={() => {
                if (perStatusChange('create') === false) {
                  return;
                }
                formRef.current?.create();
              }}
            />,
          );
        } else {
          tbList.push(tb);
        }
      });
      return tbList;
    }

    return [];
  },
  generateOperateBar<T, E, ValueType>(
    operateBar: PageOperateBar<T>[],
    rowKey: string,
    perStatusChange: PSC<T>,
    formData: (data: T) => E,
    formRef: React.MutableRefObject<ModalFormRef<E> | undefined>,
    tableRef: React.MutableRefObject<ActionType | undefined>,
    del?: (body: T) => Promise<R<any>>,
    operteBarProps?: { title?: string; width?: number; fixed?: 'left' | 'right' | boolean },
  ): ProColumns<T, ValueType> {
    return {
      title: I18n.text('form.operate'),
      width: 160,
      fixed: 'right',
      ...operteBarProps,
      hideInSearch: true,
      render: (dom, record) => {
        const nodes: React.ReactNode[] = [];

        operateBar.forEach((ob) => {
          if (typeof ob === 'function') {
            nodes.push(ob(dom, record));
            return;
          }

          let obProps;

          if (typeof ob.props === 'function') {
            obProps = ob.props(record);
          } else {
            obProps = ob.props;
          }

          if (ob.type === 'read') {
            nodes.push(
              <Auth.A
                key={`page-auth-read-${record[rowKey]}`}
                domKey={`page-auth-read-${record[rowKey]}`}
                text={defautlTitle.read}
                {...obProps}
                permission={ob.permission}
                onClick={() => {
                  if (perStatusChange('read') === false) {
                    return;
                  }
                  formRef.current?.read(formData(record));
                }}
              />,
            );
          } else if (ob.type === 'edit') {
            nodes.push(
              <Auth.A
                key={`page-auth-edit-${record[rowKey]}`}
                domKey={`page-auth-edit-${record[rowKey]}`}
                text={defautlTitle.edit}
                {...obProps}
                permission={ob.permission}
                onClick={() => {
                  if (perStatusChange('edit') === false) {
                    return;
                  }
                  formRef.current?.edit(formData(record));
                }}
              />,
            );
          } else {
            nodes.push(
              <Auth.A
                key={`page-auth-del-${record[rowKey]}`}
                domKey={`page-auth-del-${record[rowKey]}`}
                text={defautlTitle.del}
                confirmTitle={I18n.text('form.del.config')}
                {...obProps}
                style={{ color: '#ff4d4f', ...obProps?.style }}
                permission={ob.permission}
                onClick={() => {
                  if (del === undefined) {
                    I18n.error({ key: 'orm.error.request', params: { title: defautlTitle.del } });
                    return;
                  }
                  del(record).then(() => {
                    tableRef.current?.reload();
                    I18n.success('global.operation.success');
                  });
                }}
              />,
            );
          }
        });

        return <Auth.Group key={`page-auth-group-${record[rowKey]}`}>{nodes}</Auth.Group>;
      },
    };
  },
};
