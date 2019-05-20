import request from '@/utils/request'

export function login(data) {
  return request({
    // url: '/user/login',
    url: '/common/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/backend/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/common/loginOut',
    method: 'post'
  })
}

