import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/backend/article/list',
    method: 'get',
    params: query
  })
}

export function fetchArticleOrderList(query) {
  return request({
    url: '/backend/article/order/list',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: '/backend/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/backend/article/add',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/backend/article/update',
    method: 'post',
    data
  })
}
