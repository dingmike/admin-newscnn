import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/backend/course/article/list',
    method: 'get',
    params: query
  })
}

export function fetchCourseArticleDetail(id) {
  return request({
    url: '/backend/course/article/detail',
    method: 'get',
    params: { id }
  })
}

export function createCourseArticle(data) {
  return request({
    url: '/backend/course/article/add',
    method: 'post',
    data
  })
}

export function updateCourseArticle(data) {
  return request({
    url: '/backend/course/article/update',
    method: 'post',
    data
  })
}

export function deleteCourseArticle(data) {
  return request({
    url: '/backend/course/article/delete',
    method: 'post',
    data
  })
}

