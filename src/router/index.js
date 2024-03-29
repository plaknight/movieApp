import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [{
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  // 学院管理
  // {
  //   path: '/xy',
  //   component: Layout,
  //   redirect: '/xy/student',
  //   name: 'xy',
  //   meta: {
  //     title: '学生管理',
  //     icon: 'peoples'
  //   },
  //   children: [{
  //       path: 'student',
  //       component: () => import('@/views/xy/student/index'),
  //       name: 'student',
  //       meta: {
  //         title: '学员管理',
  //         icon: 'people'
  //       }
  //     },
  //     {
  //       path: 'dorm',
  //       component: () => import('@/views/xy/dorm/index.vue'),
  //       name: 'dorm',
  //       meta: {
  //         title: '宿舍管理',
  //         icon: 'dorm'
  //       }
  //     },
  //     {
  //       path: 'clazz',
  //       component: () => import('@/views/xy/clazz/index.vue'),
  //       name: 'clazz',
  //       meta: {
  //         title: '班级管理',
  //         icon: 'nested'
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: '/material',
  //   component: Layout,
  //   name: "material",
  //   redirect: "/material/imgs",
  //   meta:{
  //     title: '图片管理',
  //     icon: 'material'
  //   },
  //   children: [
  //     {
  //       path: 'imgs',
  //       name: 'imgs', // 二级路由 设置名字一般最好带上一级路由的名字
  //       component: () => import('@/views/material/index.vue'),
  //       meta: { title: '图片管理', icon: 'images' }
  //     },
  //   ]
  // },
  // {
  //   path: "/content",
  //   component: Layout,
  //   name: "content",
  //   meta:{
  //     title: '内容管理',
  //     icon: 'content'
  //   },
  //   redirect: "/content/articles",
  //   children: [
  //     {
  //       path: 'articles',
  //       name: 'articles', // 二级路由 设置名字一般最好带上一级路由的名字
  //       component: () => import('@/views/content/article/index.vue'),
  //       meta: { title: '文章管理', icon: 'article' }
  //     },
  //     {
  //       path: 'news',
  //       name: 'news', // 二级路由 设置名字一般最好带上一级路由的名字
  //       component: () => import('@/views/content/news/index.vue'),
  //       meta: { title: '新闻管理', icon: 'news' }
  //     }
  //   ]
  // },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: {
        title: 'Dashboard',
        icon: 'dashboard'
      }
    }]
  },
  {
    path: "/auth",
    component: Layout,
    redirect: '/auth/user',
    meta: { title: '权限管理', icon: 'auth' },
    children:[
      {
        path: 'user',
        name: 'authUser',
        component: () => import('@/views/auth/user/index'),
        meta: { title: '用户管理', icon: 'account' }
      },
      {
        path: 'role',
        name: 'authRole',
        component: () => import('@/views/auth/role/index'),
        meta: { title: '角色管理', icon: 'role' }
      },
      {
        path: 'menu',
        name: 'authMenu',
        component: () => import('@/views/auth/menu/index'),
        meta: { title: '菜单管理', icon: 'menu' }
      }
    ]
  },

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
