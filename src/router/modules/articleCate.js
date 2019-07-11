/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const articleCateRouter = {
  path: '/articleCate',
  component: Layout,
  redirect: '/articleCate/list',
  name: 'ArticleCate',
  meta: {
    title: 'articleCate',
    icon: 'example'
  },
  children: [
    {
      path: 'add',
      component: () => import('@/views/articleCate/add'),
      name: 'AddArticleCate',
      meta: { title: 'addArticleCate', icon: 'edit' },
      hidden: true
    },
    {
      path: 'update',
      component: () => import('@/views/articleCate/update'),
      name: 'UpdateArticleCate',
      meta: { title: 'updateArticleCate', noCache: true, activeMenu: '/articleCate/list' },
      hidden: true
    },
    {
      path: 'list',
      component: () => import('@/views/articleCate/index'),
      name: 'ArticleCateList',
      meta: { title: 'articleCateList', icon: 'list' }
    },
    // 课程目录
    {
      path: 'addCourse',
      component: () => import('@/views/course/add'),
      name: 'AddCourse',
      meta: { title: 'addCourse', icon: 'edit' },
      hidden: true
    },
    {
      path: 'updateCourse',
      component: () => import('@/views/course/update'),
      name: 'UpdateCourse',
      meta: { title: 'updateCourse', noCache: true, activeMenu: '/course/list' },
      hidden: true
    },
    {
      path: 'courseList',
      component: () => import('@/views/course/index'),
      name: 'CourseList',
      meta: { title: 'courseList', icon: 'list' }
    },
    {
      path: 'courseArticle',
      component: () => import('@/views/course/courseArticle'),
      name: 'CourseArticle',
      meta: { title: 'courseArticle', noCache: true, activeMenu: '/course/list' },
      hidden: true
    }
  ]
}
export default articleCateRouter
