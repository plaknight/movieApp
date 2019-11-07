import request from '@/api/request'

function getDormList(data) {
  return request({
    url: "/admin/xy/dorm/list",
    method: 'get',
    data: data
  })
}

function addDorm(data) {
  return request({
    url: "/admin/xy/dorm/save",
    method: "post",
    data: data
  })
}

function delDorm(data) {
  return request({
    url: "/admin/xy/dorm/del",
    method: "get",
    data: data
  })
}

function getDormDetail(data) {
  return request({
    url: "/admin/xy/dorm/detail",
    method: "get",
    data: data
  })
}

function updateDorm(data) {
  return request({
    url: "/admin/xy/dorm/update",
    method: "post",
    data: data
  })
}
export default {
  getDormList,
  addDorm,
  delDorm,
  getDormDetail,
  updateDorm
}
