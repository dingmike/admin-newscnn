import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/backend/timer/list',
    method: 'get',
    params: query
  })
}

export function addTimer(data) {
  return request({
    url: '/backend/timer/add',
    method: 'post',
    data
  })
}
export function updateTimer(data) {
  return request({
    url: '/backend/timer/update',
    method: 'post',
    data
  })
}
export function deleteTimer(data) {
  return request({
    url: '/backend/timer/delete',
    method: 'post',
    data
  })
}
export function runTimer(data) {
  return request({
    url: '/backend/timer/run',
    method: 'post',
    data
  })
}
export function cancelTimer(data) {
  return request({
    url: '/backend/timer/cancel',
    method: 'post',
    data
  })
}

// 文件管理
export function filesList(query) {
  return request({
    url: '/backend/upload/list',
    method: 'get',
    params: query
  })
}
export function deleteFile(data) {
  return request({
    url: '/backend/upload/delete',
    method: 'post',
    data: data
  })
}
