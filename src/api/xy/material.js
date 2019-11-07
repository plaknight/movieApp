import request from '@/api/request'

function getMaterialList(data) {
  return request({
    url: "/admin/xy/upload/list",
    method: 'POST',
    data: data
  })
}

function updateTitle(data) {
  return request({
    url: "/admin/xy/upload/updateTitle",
    method: 'POST',
    data: data
  })
}

function delImage(data) {
  return request({
    url: "/admin/xy/upload/del",
    method: 'POST',
    data: data
  })
}
export default {
  getMaterialList,
  updateTitle,
  delImage
}
