/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const wechatRouter = {
  path: '/wechat',
  component: Layout,
  redirect: '/table/complex-table',
  name: 'wechat',
  meta: {
    title: 'wechat',
    icon: 'wechat'
  },
  children: [
    {
      path: 'wechat/menu',
      component: () => import('@/views/wechat/menu'),
      name: 'wechat-menu',
      meta: { title: 'menu', icon: 'form' }
    },
    {
      path: '',
      component: () => import('@/views/wechat/user'),
      name: 'wechat/user',
      meta: { title: 'user', icon: 'peoples' }
    }
  ]
}
export default wechatRouter
