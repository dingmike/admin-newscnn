import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getMenu() {
  return request({
    url: '/backend/wechat/menu/list',
    method: 'get',
    params: {}
  })
}
export function addMenu(data) {
  return request({
    url: '/backend/wechat/menu/add',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

