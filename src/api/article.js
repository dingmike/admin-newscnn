import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/backend/article/list',
    method: 'get',
    params: query
  })
}
export function fetchCateArticleList(query) {
  return request({
    url: '/backend/article/cate/list',
    method: 'get',
    params: query
  })
}
export function fetchCourseCateArticleList(query) {
  return request({
    url: '/backend/article/courseCate/list',
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
export function deleteOrderById(query) {
  return request({
    url: '/backend/article/order/delete',
    method: 'get',
    params: query
  })
}
export function changeOrderStatusById(query) {
  return request({
    url: '/backend/article/order/change',
    method: 'get',
    params: query
  })
}
// 暂时不支持
export function reactRefundArticleOrder(data) {
  return request({
    url: '/backend/article/order/reactRefund',
    method: 'post',
    data
  })
}

export function fetchArticle(id) {
  return request({
    url: '/backend/article/detail',
    method: 'get',
    params: { id }
  })
}

export function deleteArticle(data) {
  return request({
    url: '/backend/article/delete',
    method: 'post',
    data
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
