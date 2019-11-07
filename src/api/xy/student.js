import request from '@/api/request'
//获取学员列表
function getStudentList(data) {
  // console.log(start,limit)
  return request({
    url: `/admin/xy/student/list`,
    method: 'get',
    data: data
  })
}
//增加学员
function saveStudent(data) {
  return request({
    url: '/admin/xy/student/save',
    method: 'post',
    data: data
  })
}
//删除学员
function deleteStudent(id) {
  return request({
    url: `/admin/xy/student/del?id=${id}`,
    method: 'get',
  })
}

//学员编辑
function editStudent(id) {
  return request({
    url: `/admin/xy/student/detail?id=${id}`,
    method: 'get'
  })
}

function updateStudent(data) {
  return request({
    url: `/admin/xy/student/update`,
    method: 'post',
    data: data
  })
}


//获取缴费明细
function paymentCost(data) {
  return request({
    url: `/admin/xy/cost/list`,
    method: 'post',
    data: data
  })
}
export default {
  getStudentList,
  saveStudent,
  deleteStudent,
  editStudent,
  updateStudent,
  paymentCost
  // searchStudent
}
