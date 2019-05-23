/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const articleRouter = {
  path: '/article',
  component: Layout,
  redirect: '/article/list',
  name: 'Article',
  meta: {
    title: 'article',
    icon: 'example'
  },
  children: [
    {
      path: 'create',
      component: () => import('@/views/article/create'),
      name: 'CreateArticle',
      meta: { title: 'createArticle', icon: 'edit' }
    },
    {
      path: 'edit/:id',
      component: () => import('@/views/article/edit'),
      name: 'EditArticle',
      meta: { title: 'editArticle', noCache: true, activeMenu: '/article/list' },
      hidden: true
    },
    {
      path: 'list',
      component: () => import('@/views/article/list'),
      name: 'ArticleList',
      meta: { title: 'articleList', icon: 'list' }
    }
  ]
}
export default articleRouter
