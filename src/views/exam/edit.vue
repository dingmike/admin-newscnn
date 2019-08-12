<template>
  <exam-detail :is-edit="true" />
</template>

<script>
import ExamDetail from './components/ExamDetail'

export default {
  name: 'EditForm',
  components: { ExamDetail }
}
</script>

