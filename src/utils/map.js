export default {
   "Layout": require('@/layout').default,
   'student': () => import('@/views/xy/student/index'),
   "dorm": () => import('@/views/xy/dorm/index.vue'),
   "clazz": () => import('@/views/xy/clazz/index.vue'),
   "material": () => import('@/views/material/index.vue'),
   "articles": () => import('@/views/content/article/index.vue'),
   "news": () => import('@/views/content/news/index.vue'),
}
