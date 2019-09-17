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
    // 添加文章分类
    {
      path: 'add',
      component: () => import('@/views/articleCate/add'),
      name: 'AddArticleCate',
      meta: { title: 'addArticleCate', icon: 'edit' },
      hidden: true
    },
    // 跟新文章分类
    {
      path: 'update',
      component: () => import('@/views/articleCate/update'),
      name: 'UpdateArticleCate',
      meta: { title: 'updateArticleCate', noCache: true, activeMenu: '/articleCate/list' },
      hidden: true
    },
    // 文章分类列表
    {
      path: 'articleCateList',
      component: () => import('@/views/articleCate/index'),
      name: 'ArticleCateList',
      meta: { title: 'articleCateList', icon: 'list' }
    },
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
