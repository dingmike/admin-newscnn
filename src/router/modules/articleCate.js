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
      meta: { title: 'addArticleCate', icon: 'edit' }
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
    }
  ]
}
export default articleCateRouter
