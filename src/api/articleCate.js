import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/backend/category/list',
    method: 'get',
    params: query
  })
}
// 所有已发布的分类
export function fetchAllList(query) {
  return request({
    url: '/backend/category/allList',
    method: 'get',
    params: query
  })
}

export function fetchCategoryDetail(id) {
  return request({
    url: '/backend/category/detail',
    method: 'get',
    params: { id }
  })
}

export function createCategory(data) {
  return request({
    url: '/backend/category/add',
    method: 'post',
    data
  })
}

export function updateCategory(data) {
  return request({
    url: '/backend/category/update',
    method: 'post',
    data
  })
}

export function updateCategoryStatus(data) {
  return request({
    url: '/backend/category/status',
    method: 'post',
    data
  })
}

export function deleteCategory(data) {
  return request({
    url: '/backend/category/delete',
    method: 'post',
    data
  })
}

