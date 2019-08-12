<template>
  <exam-detail :is-edit="false" />
</template>

<script>
import ExamDetail from './components/ExamDetail'

export default {
  name: 'CreateForm',
  components: { ExamDetail }
}
</script>

