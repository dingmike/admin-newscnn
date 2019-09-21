import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/backend/userPayed/article/list',
    method: 'get',
    params: query
  })
}

export function deleteById(query) {
  return request({
    url: '/backend/userPayed/article/delete',
    method: 'get',
    params: query
  })
}

export function getById(query) {
  return request({
    url: '/backend/userPayed/article/detail',
    method: 'get',
    params: query
  })
}
