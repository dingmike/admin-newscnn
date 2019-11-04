/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const articleRouter = {
  path: '/banner',
  component: Layout,
  redirect: '/banner/index',
  name: 'Banner',
  meta: {
    title: 'banner',
    icon: 'adBanner'
  },
  children: [
    {
      path: 'index',
      component: () => import('@/views/banner/index'),
      name: 'Bannerlist',
      meta: { title: 'bannerlist', icon: 'adBanner' }
    }
  ]
}
export default articleRouter
