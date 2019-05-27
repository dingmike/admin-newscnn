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

