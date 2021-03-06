import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/backend/exam/list',
    method: 'get',
    params: query
  })
}
// 考试记录
export function fetchRecordList(query) {
  return request({
    url: '/backend/exam/record/list',
    method: 'get',
    params: query
  })
}
export function fetchCateExamList(query) {
  return request({
    url: '/backend/exam/category/list',
    method: 'get',
    params: query
  })
}

export function fetchExam(id) {
  return request({
    url: '/backend/exam/detail',
    method: 'get',
    params: { id }
  })
}
// 删除记录
export function deleteExamRecord(data) {
  return request({
    url: '/backend/exam/record/delete',
    method: 'post',
    data
  })
}
export function wordsAndSentences(query) {
  return request({
    url: '/backend/exam/wordsAndSentences',
    method: 'get',
    params: query
  })
}

export function deleteExam(data) {
  return request({
    url: '/backend/exam/delete',
    method: 'post',
    data
  })
}

export function createExam(data) {
  return request({
    url: '/backend/exam/add',
    method: 'post',
    data
  })
}

export function updateExam(data) {
  return request({
    url: '/backend/exam/update',
    method: 'post',
    data
  })
}
