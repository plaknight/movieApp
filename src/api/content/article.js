import request from '@/api/request'

function articleList(data) {
  return request({
    url: "/admin/xy/news/list",
    method: 'get',
    data: data
  })
}

function saveArticle(data) {
  return request({
    url: "/admin/xy/news/save",
    method: 'post',
    data: data
  })
}

function delArticle(data) {
  return request({
    url: " /admin/xy/news/del",
    method: 'get',
    data: data
  })
}

function editArticle(data){  
  return request({
    url: "/admin/xy/news/detail",
    method: 'get',
    data: data
  })
}
function updateArticle(data){
  return request({
    url: "/admin/xy/news/update",
    method: 'post',
    data: data
  })
}
export default {
  articleList,
  saveArticle,
  delArticle,
  editArticle,
  updateArticle
}
