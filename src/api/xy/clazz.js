import request from '@/api/request'

function getClassList(data) {
  return request({
    url: "/admin/xy/clazz/list",
    method: 'get',
    data: data
  })
}

function getClassMsg(data) {
  return request({
    url: "/admin/xy/clazz/detail",
    method: 'get',
    data: data
  })
}

function addClass(data) {
  return request({
    url: "/admin/xy/clazz/save",
    method: 'post',
    data: data
  })
}

function updateClass(data) {
  return request({
    url: "/admin/xy/clazz/update",
    method: 'post',
    data: data
  })
}
function delClass(data){
  return request({
    url: "/admin/xy/clazz/del",
    method: "get",
    data: data
  })
}
export default {
  getClassList,
  getClassMsg,
  updateClass,
  addClass,
  delClass
}
