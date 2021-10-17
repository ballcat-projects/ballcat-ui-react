import type { PageResult, QueryParam, R } from '@/typings';
import { request } from 'umi';
import type { Document, DocumentQo, DocumentVo } from './typings';

export async function query(body: QueryParam<DocumentQo>) {
  return request<R<PageResult<DocumentVo>>>('sample/document/page', {
    method: 'GET',
    params: body,
  });
}

export async function create(body: Document) {
  return request<R<any>>('sample/document', {
    method: 'POST',
    data: body,
  });
}

export async function edit(body: Document) {
  return request<R<any>>('sample/document', {
    method: 'PUT',
    data: body,
  });
}

export async function del(body: DocumentVo) {
  return request<R<any>>(`sample/document/${body.id}`, {
    method: 'DELETE',
  });
}
