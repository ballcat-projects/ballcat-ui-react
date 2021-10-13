import type { PageResult, QueryParam, R } from '@/typings';
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
  return request<R<any>>(`notify/announcement/publish/${body.id}`, {
    method: 'PATCH',
  });
}

export function close(body: AnnouncementVo) {
  return request<R<any>>(`notify/announcement/close/${body.id}`, {
    method: 'PATCH',
  });
}

export function uploadImage(blobs: Blob[]) {
  const fd = new FormData();
  blobs.forEach((blob) => {
    fd.append('files', blob);
  });

  return request<R<string[]>>('notify/announcement/image', {
    method: 'POST',
    body: fd,
  });
}

export function getUserAnnouncements() {
  return request<R<any>>('notify/announcement/user', {
    method: 'GET',
  });
}

export function readAnnouncement(id: string) {
  return request<R<any>>(`notify/user-announcement/read/${id}`, {
    method: 'PATCH',
  });
}
