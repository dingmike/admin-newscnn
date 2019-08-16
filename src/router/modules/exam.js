/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const examRouter = {
  path: '/exam',
  component: Layout,
  redirect: '/exam/list',
  name: 'Exam',
  meta: {
    title: 'exam',
    icon: 'example'
  },
  children: [
    {
      path: 'create',
      component: () => import('@/views/exam/create'),
      name: 'CreateExam',
      meta: { title: 'createExam', icon: 'edit' }
    },
    {
      path: 'edit/:id',
      component: () => import('@/views/exam/edit'),
      name: 'EditExam',
      meta: { title: 'editExam', noCache: true, activeMenu: '/exam/list' },
      hidden: true
    },
    {
      path: 'list',
      component: () => import('@/views/exam/list'),
      name: 'ExamList',
      meta: { title: 'examList', icon: 'list' }
    },
    {
      path: 'record',
      component: () => import('@/views/exam/recordList'),
      name: 'ExamRecord',
      meta: { title: 'examRecord', icon: 'list' }
    }
  ]
}
export default examRouter
