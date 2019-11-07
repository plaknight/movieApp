import request from '@/api/request'

function getDashboard(data) {
  return request({
    url: "/admin/xy/dashboard/base",
    method: 'get',
    data: data
  })
}
export default {
    getDashboard
}