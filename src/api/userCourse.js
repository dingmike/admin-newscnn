import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/backend/user/course/list',
    method: 'get',
    params: query
  })
}

export function fetchDetail(id) {
  return request({
    url: '/backend/user/course/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchCourseDayList(query) {
  return request({
    url: '/backend/user/courseDay/list',
    method: 'get',
    params: query
  })
}

export function deleteUserCourse(data) {
  return request({
    url: '/backend/user/course/delete',
    method: 'post',
    data
  })
}
