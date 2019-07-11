<template>
  <course-detail :is-edit="true" />
</template>
<script>
import CourseDetail from './components/CourseDetail'
export default {
  name: 'UpdateCourse',
  components: { CourseDetail }
}
</script>
<style>
</style>

