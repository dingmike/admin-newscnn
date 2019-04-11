/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const wechatRouter = {
  path: '/wechat',
  component: Layout,
  redirect: '/table/complex-table',
  name: 'wechat',
  meta: {
    title: 'wechat',
    icon: 'table'
  },
  children: [
    {
      path: 'dynamic-table',
      component: () => import('@/views/wechat/menu'),
      name: 'wechat-menu',
      meta: { title: 'menu' }
    },
    {
      path: 'dynamic-table',
      component: () => import('@/views/dashboard/editor'),
      name: 'wechat-menu',
      meta: { title: 'menu' }
    }
  ]
}
export default wechatRouter
