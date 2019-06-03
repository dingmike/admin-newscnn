import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/backend/job/list',
    method: 'get',
    params: query
  })
}

export function addQueue(data) {
  return request({
    url: '/backend/job/add',
    method: 'post',
    data
  })
}
export function deleteQueue(data) {
  return request({
    url: '/backend/job/deleteQueue',
    method: 'post',
    data
  })
}
export function updateQueue(data) {
  return request({
    url: '/backend/job/update',
    method: 'post',
    data
  })
}
export function deleteTimer(data) {
  return request({
    url: '/backend/job/delete',
    method: 'post',
    data
  })
}
export function runQueue(data) {
  return request({
    url: '/backend/job/start',
    method: 'post',
    data
  })
}
export function pauseQueue(data) {
  return request({
    url: '/backend/job/pause',
    method: 'post',
    data
  })
}
export function resumeQueue(data) {
  return request({
    url: '/backend/job/resume',
    method: 'post',
    data
  })
}

