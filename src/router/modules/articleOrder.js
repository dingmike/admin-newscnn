/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const orderRouter = {
  path: '/order',
  component: Layout,
  redirect: '/order/articleOrder',
  name: 'order',
  meta: {
    title: 'order',
    icon: 'money'
  },
  children: [
    {
      path: '/order/articleOrder',
      component: () => import('@/views/order/articleOrder'),
      name: 'articleOrder',
      meta: { title: 'articleOrder', icon: 'order' }
    },
    {
      path: 'userPayedArticle',
      component: () => import('@/views/order/userPayedArticle'),
      name: 'UserPayedArticle',
      meta: { title: 'userPayedArticle', icon: 'articleOrder' }
    },
    {
      path: 'userCourseList',
      component: () => import('@/views/userCourse/index'),
      name: 'UserCourseList',
      meta: { title: 'userCourseList', icon: 'courseOrder' }
    },
    {
      path: 'courseArticle',
      component: () => import('@/views/userCourse/courseArticle'),
      name: 'CourseArticle',
      meta: { title: 'userCourseArticle', noCache: true, activeMenu: '/userCourseList/list' },
      hidden: true
    }
  ]
}
export default orderRouter
