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
export function deleteUser(id) {
  return request({
    url: '/backend/wechat/user/deleteUser',
    method: 'post',
    data: { id }
  })
}
export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

// 获取用户列表
export function getUserList(params) {
  return request({
    url: '/backend/wechat/user/list',
    method: 'get',
    params
  })
}
// 更新用户信息
export function updateUser(data) {
  return request({
    url: '/backend/wechat/user/update',
    method: 'post',
    data
  })
}
