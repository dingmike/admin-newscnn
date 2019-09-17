/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const courseCateRouter = {
  path: '/courseCate',
  component: Layout,
  redirect: '/courseCate/list',
  name: 'CourseCate',
  meta: {
    title: 'courseCate',
    icon: 'example'
  },
  children: [
    {
      path: 'add',
      component: () => import('@/views/courseCate/add'),
      name: 'AddCourseCate',
      meta: { title: 'addCourseCate', icon: 'edit' },
      hidden: true
    },
    {
      path: 'update',
      component: () => import('@/views/courseCate/update'),
      name: 'UpdateCourseCate',
      meta: { title: 'updateCourseCate', noCache: true, activeMenu: '/courseCate/list' },
      hidden: true
    },
    {
      path: 'list',
      component: () => import('@/views/courseCate/index'),
      name: 'CourseCateList',
      meta: { title: 'courseCateList', icon: 'list' }
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
export default courseCateRouter
