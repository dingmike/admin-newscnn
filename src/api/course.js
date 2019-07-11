import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/backend/course/list',
    method: 'get',
    params: query
  })
}

export function fetchCourseDetail(id) {
  return request({
    url: '/backend/course/detail',
    method: 'get',
    params: { id }
  })
}

export function createCourse(data) {
  return request({
    url: '/backend/course/add',
    method: 'post',
    data
  })
}

export function updateCourse(data) {
  return request({
    url: '/backend/course/update',
    method: 'post',
    data
  })
}

export function updateCourseStatus(data) {
  return request({
    url: '/backend/course/status',
    method: 'post',
    data
  })
}

export function deleteCourse(data) {
  return request({
    url: '/backend/course/delete',
    method: 'post',
    data
  })
}

