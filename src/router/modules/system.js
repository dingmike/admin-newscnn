/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const systemRouter = {
  path: '/system',
  component: Layout,
  redirect: '/system/schedule',
  name: 'system',
  meta: {
    title: 'system',
    icon: 'tree'
  },
  children: [
    {
      path: 'controlPanel',
      component: () => import('@/views/system/controlPanel'),
      name: 'controlPanel',
      meta: { title: 'controlPanel', icon: 'star' }
    },
    {
      path: 'schedule',
      component: () => import('@/views/system/schedule'),
      name: 'schedule',
      meta: { title: 'schedule', icon: 'schedule' }
    },
    {
      path: 'files',
      component: () => import('@/views/system/files'),
      name: 'files',
      meta: { title: 'files', icon: 'file' }
    },
    {
      path: 'requestLog',
      component: () => import('@/views/errorLog/requestLog'),
      name: 'requestLog',
      meta: { title: 'requestLog', icon: 'bug' }
    },
    {
      path: 'errorsLog',
      component: () => import('@/views/errorLog/errorLog'),
      name: 'ErrorLog',
      meta: { title: 'errorLog', icon: 'bug' }
    }
  ]
}
export default systemRouter
