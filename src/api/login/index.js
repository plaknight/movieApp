import request from '@/api/request'

function login(data) {
  return request({
    url: "/admin/login/doLogin",
    method: 'post',
    data: data
  })
}

function logout(data) {
  return request({
    url: "/admin/login/doLogOut",
    method: 'get',
    data: data
  })
}

function  getUserInfo(data) {
  return request({
    url: "/admin/login/getUserInfo",
    method: 'get',
    data: data
  })
}

function initLogin(data) {
  return request({
    url: "/admin/sys/user/getClientMenu",
    method: 'get',
    data: data
  })
}
// function delClass(data){
//   return request({
//     url: "/admin/xy/clazz/del",
//     method: "get",
//     data: data
//   })
// }
export default {
    login,
    logout,
    getUserInfo,
    initLogin
}
