/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const systemRouter = {
  path: '/system',
  component: Layout,
  redirect: '/system/schedule',
  name: 'system',
  meta: {
    title: 'system',
    icon: 'table'
  },
  children: [
    {
      path: 'schedule',
      component: () => import('@/views/system/schedule'),
      name: 'schedule',
      meta: { title: 'schedule' }
    }
  ]
}
export default systemRouter
