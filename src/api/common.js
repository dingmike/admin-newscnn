import request from '@/utils/request'

export function fetchErrorLogList(query) {
  return request({
    url: '/backend/log/error',
    method: 'get',
    params: query
  })
}
export function fetchRequestLogList(query) {
  return request({
    url: '/backend/log/request',
    method: 'get',
    params: query
  })
}

