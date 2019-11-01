/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const articleRouter = {
  path: '/activity',
  component: Layout,
  redirect: '/activity/index',
  name: 'Activity',
  meta: {
    title: 'activity',
    icon: 'shopping'
  },
  children: [
    {
      path: 'index',
      component: () => import('@/views/activity/index'),
      name: 'Activitylist',
      meta: { title: 'activitylist', icon: 'shopping' }
    }
  ]
}
export default articleRouter
