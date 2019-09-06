import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/backend/activity/list',
    method: 'get',
    params: query
  })
}

export function fetchOne(id) {
  return request({
    url: '/backend/activity/detail',
    method: 'get',
    params: { id }
  })
}

export function deleteOne(data) {
  return request({
    url: '/backend/activity/delete',
    method: 'post',
    data
  })
}
export function updateStatus(data) {
  return request({
    url: '/backend/activity/status',
    method: 'post',
    data
  })
}
export function createOne(data) {
  return request({
    url: '/backend/activity/add',
    method: 'post',
    data
  })
}

export function updateOne(data) {
  return request({
    url: '/backend/activity/update',
    method: 'post',
    data
  })
}
