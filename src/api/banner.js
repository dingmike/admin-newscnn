import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/backend/banner/list',
    method: 'get',
    params: query
  })
}
export function fetchCateBannerList(query) {
  return request({
    url: '/backend/banner/category/list',
    method: 'get',
    params: query
  })
}

export function fetchBanner(id) {
  return request({
    url: '/backend/banner/detail',
    method: 'get',
    params: { id }
  })
}

export function deleteBanner(data) {
  return request({
    url: '/backend/banner/delete',
    method: 'post',
    data
  })
}

export function createBanner(data) {
  return request({
    url: '/backend/banner/add',
    method: 'post',
    data
  })
}

export function updateBanner(data) {
  return request({
    url: '/backend/banner/update',
    method: 'post',
    data
  })
}
