import type { PageResult, QueryParam, R } from '@/typings';
import type { UploadFile } from 'antd/lib/upload/interface';
import { request } from 'umi';
import type { AnnouncementDto, AnnouncementQo, AnnouncementVo } from './typings';

export async function query(body: QueryParam<AnnouncementQo>) {
  return request<R<PageResult<AnnouncementVo>>>('notify/announcement/page', {
    method: 'GET',
    params: body,
  });
}

export async function create(body: AnnouncementDto) {
  return request<R<any>>('notify/announcement', {
    method: 'POST',
    data: body,
  });
}

export async function edit(body: AnnouncementDto) {
  return request<R<any>>('notify/announcement', {
    method: 'PUT',
    data: body,
  });
}

export async function del(body: AnnouncementVo) {
  return request<R<any>>(`notify/announcement/${body.id}`, {
    method: 'DELETE',
  });
}

export function publish(body: AnnouncementVo) {
  return request(`notify/announcement/publish/${body.id}`, {
    method: 'patch',
  });
}

export function close(body: AnnouncementVo) {
  return request(`notify/announcement/close/${body.id}`, {
    method: 'patch',
  });
}

export function uploadImage(resultFiles: UploadFile[]) {
  const formData = new FormData();
  resultFiles.forEach((file) => {
    formData.append('files', file.originFileObj as Blob);
  });
  return request('notify/announcement/image', {
    body: formData,
  });
}

export function getUserAnnouncements() {
  return request('notify/announcement/user', {
    method: 'get',
  });
}

export function readAnnouncement(id: string) {
  return request(`notify/user-announcement/read/${id}`, {
    method: 'patch',
  });
}
